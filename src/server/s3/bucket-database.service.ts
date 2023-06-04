import { Injectable, NotFoundException } from '@nestjs/common';
import { createHash } from 'crypto';
import path from 'path';
import { AsyncDatabase } from 'promised-sqlite3';
import { v4 } from 'uuid';
import { Properties } from './item.service';
import { UtilService } from './util.service';

export type AddItem = {
	hash: string;
	path: string;
	name: string;
	mimeType: string;
	updateAt: number;
	isDir: number;
	size: number;
}

@Injectable()
export class BucketDatabaseService {
	constructor(
		private readonly utilService: UtilService,
	) {
	}

	async open(pathDir: string): Promise<AsyncDatabase> {
		const scripts = await this.utilService.getTablesArr();
		const dbPath = path.join(pathDir, 'user-paths.db');
		const isExist = await this.utilService.isExist(dbPath);

		const sqlite = await AsyncDatabase.open(dbPath);
		if (!isExist)
			for (let script of scripts)
				await sqlite.run(script);

		await sqlite.run('PRAGMA foreign_keys = ON');
		return sqlite;
	}

	async get(sqlite: AsyncDatabase, key: string): Promise<Properties | null> {

		const properties: any = await sqlite.get(`SELECT hash,
                                                     path,
                                                     is_dir,
                                                     name,
                                                     size,
                                                     mime_type,
                                                     update_at,
                                                     delete_time,
                                                     count_delete   AS is_delete,
                                                     count_favorite AS is_favorite,
                                                     count_share    AS is_share
                                              FROM paths p
                                                       LEFT JOIN (SELECT hash AS delete_hash, COUNT(hash) AS count_delete, delete_time
                                                                  FROM delete_paths
                                                                  GROUP BY hash) AS dp
                                                                 ON dp.delete_hash = p.hash
                                                       LEFT JOIN (SELECT hash AS favorite_hash, COUNT(hash) AS count_favorite
                                                                  FROM favorite_paths
                                                                  GROUP BY hash) AS fp
                                                                 ON fp.favorite_hash = p.hash
                                                       LEFT JOIN (SELECT hash AS share_hash, COUNT(hash) AS count_share
                                                                  FROM share_paths
                                                                  GROUP BY hash) AS sh ON sh.share_hash = p.hash

                                              WHERE p.hash = $hash;`, { $hash: key });
		await sqlite.run(`UPDATE paths
                      SET update_at = $time
                      WHERE hash = $hash;`, {
			$time: (new Date()).getTime(),
			$hash: key,
		});

		if (!properties)
			return null;

		return {
			path: await this.utilService.clearPath(properties.path),
			deleteAt: (properties.delete_time) ? new Date(properties.delete_time) : null,
			fileType: path.extname(properties.name).replace('.', ''),
			hash: properties.hash,
			sizeBytes: properties.size,
			isDelete: Boolean(properties.is_delete),
			isDir: Boolean(properties.is_dir),
			isFavorite: Boolean(properties.is_favorite),
			mimeType: properties.mime_type,
			name: properties.name,
			size: await this.utilService.convert(properties.size),
			updateAt: new Date(properties.update_at),
			isShare: Boolean(properties.is_share),
		};
	}

	async getItems(sqlite: AsyncDatabase, getPath: string) {
		const result: Array<Properties> = [];
		const items: any = await sqlite.all(`SELECT hash,
                                                path,
                                                is_dir,
                                                name,
                                                size,
                                                mime_type,
                                                update_at,
                                                delete_time,
                                                count_delete   AS is_delete,
                                                count_favorite AS is_favorite,
                                                count_share    AS is_share
                                         FROM paths p
                                                  LEFT JOIN (SELECT hash AS delete_hash, COUNT(hash) AS count_delete, delete_time
                                                             FROM delete_paths
                                                             GROUP BY hash) AS dp
                                                            ON dp.delete_hash = p.hash
                                                  LEFT JOIN (SELECT hash AS favorite_hash, COUNT(hash) AS count_favorite
                                                             FROM favorite_paths
                                                             GROUP BY hash) AS fp
                                                            ON fp.favorite_hash = p.hash
                                                  LEFT JOIN (SELECT hash AS share_hash, COUNT(hash) AS count_share
                                                             FROM share_paths
                                                             GROUP BY hash) AS sh ON sh.share_hash = p.hash
                                         WHERE path LIKE $getPath || '%'
                                           AND is_delete IS NULL;`, {
			$getPath: getPath,
		});

		for (const item of items) {
			const base = path.parse(item.path).dir;
			if (path.join(base, '/') === getPath) {
				if (item.is_dir)
					item.size = await this.sumFolderSize(sqlite, item.path);
				result.push({
					path: await this.utilService.clearPath(item.path),
					deleteAt: (item.delete_time) ? new Date(item.delete_time) : null,
					fileType: path.extname(item.name).replace('.', ''),
					hash: item.hash,
					sizeBytes: item.size,
					isDelete: Boolean(item.is_delete),
					isDir: Boolean(item.is_dir),
					isFavorite: Boolean(item.is_favorite),
					mimeType: item.mime_type,
					name: item.name,
					size: await this.utilService.convert(item.size),
					updateAt: new Date(item.update_at),
					isShare: Boolean(item.is_share),
				});
			}
		}
		return result;
	}

	async updatePath(sqlite: AsyncDatabase, oldPath: string, newPath: string) {
		const items: any = await sqlite.all(`SELECT *
                                         FROM paths
                                         WHERE path LIKE $path || '/%'`, { $path: oldPath });
		for (const item of items) {
			const updatePath = item.path.replace(oldPath, newPath).replace(/\/\//g, '/');
			const newHash = createHash('md5').update(updatePath).digest('hex');
			await sqlite.run('UPDATE paths SET hash = $newHash, path = $newPath, name = $newName WHERE hash = $hash', {
				$newHash: newHash,
				$newPath: updatePath,
				$newName: path.basename(updatePath),
				$hash: item.hash,
			});
		}
	}

	async copyPath(sqlite: AsyncDatabase, oldPath: string, newPath: string) {
		const items: any = await sqlite.all(`SELECT *
                                         FROM paths
                                         WHERE path LIKE $path || '/%'`, { $path: oldPath });
		for (const item of items) {
			let dir = path.parse(oldPath).dir;
			if (oldPath === path.join(path.parse(oldPath).dir, 'files', '/'))
				dir = oldPath;
			// const dir = path.parse(oldPath).dir;
			const updatePath = item.path.replace(dir, newPath).replace(/\/\//g, '/');
			const newHash = createHash('md5').update(updatePath).digest('hex');
			await sqlite.run('INSERT INTO paths (hash, path, name, mime_type, update_at, is_dir, size) VALUES ($hash, $path, $name, $mime_type, $update_at, $is_dir, $size)', {
				$hash: newHash,
				$path: updatePath,
				$name: item.name,
				$mime_type: item.mime_type,
				$update_at: item.update_at,
				$is_dir: item.is_dir,
				$size: item.size,
			});
		}
	}

	async add(sqlite: AsyncDatabase, file: AddItem) {
		await sqlite.run('INSERT INTO paths (hash, path, name, mime_type, update_at, is_dir, size) VALUES ($hash, $path, $name, $mime_type, $update_at, $is_dir, $size)', {
			$hash: file.hash,
			$path: file.path.replace(/\/\//g, '/'),
			$name: file.name,
			$mime_type: file.mimeType,
			$update_at: file.updateAt,
			$is_dir: file.isDir,
			$size: file.size,
		});
	}

	async getDeletes(sqlite: AsyncDatabase) {
		const result: Array<Properties> = [];
		const items: any = await sqlite.all(`SELECT hash,
                                                path,
                                                is_dir,
                                                name,
                                                size,
                                                mime_type,
                                                update_at,
                                                delete_time,
                                                count_delete   AS is_delete,
                                                count_favorite AS is_favorite
                                         FROM paths p
                                                  LEFT JOIN (SELECT hash AS delete_hash, COUNT(hash) AS count_delete, delete_time
                                                             FROM delete_paths
                                                             GROUP BY hash) AS dp
                                                            ON dp.delete_hash = p.hash
                                                  LEFT JOIN (SELECT hash AS favorite_hash, COUNT(hash) AS count_favorite
                                                             FROM favorite_paths
                                                             GROUP BY hash) AS fp
                                                            ON fp.favorite_hash = p.hash
                                         WHERE is_delete IS NOT NULL;`);

		for (const item of items) {
			if (item.is_dir)
				item.size = await this.sumFolderSize(sqlite, item.path);
			result.push({
				path: await this.utilService.clearPath(item.path),
				deleteAt: (item.delete_time) ? new Date(item.delete_time) : null,
				fileType: path.extname(item.name).replace('.', ''),
				hash: item.hash,
				isDelete: Boolean(item.is_delete),
				isDir: Boolean(item.is_dir),
				isFavorite: Boolean(item.is_favorite),
				mimeType: item.mime_type,
				name: item.name,
				sizeBytes: item.size,
				size: await this.utilService.convert(item.size),
				updateAt: new Date(item.update_at),
			});
		}
		return result;
	}

	async setDelete(sqlite: AsyncDatabase, key: string) {
		await sqlite.run(`INSERT INTO delete_paths (hash, delete_time)
                      VALUES ($hash, $dt)`, {
			$hash: key,
			$dt: (new Date()).getTime(),
		});
	}

	async unsetDelete(sqlite: AsyncDatabase, key: string) {
		await sqlite.run(`DELETE
                      FROM delete_paths
                      WHERE hash = $hash`, {
			$hash: key,
		});
	}

	async remove(sqlite: AsyncDatabase, hash: string): Promise<string> {
		const item: any = await sqlite.get(`SELECT hash,
                                               path,
                                               is_dir,
                                               name,
                                               size,
                                               mime_type,
                                               update_at,
                                               delete_time,
                                               count_delete   AS is_delete,
                                               count_favorite AS is_favorite
                                        FROM paths p
                                                 LEFT JOIN (SELECT hash AS delete_hash, COUNT(hash) AS count_delete, delete_time
                                                            FROM delete_paths
                                                            GROUP BY hash) AS dp
                                                           ON dp.delete_hash = p.hash
                                                 LEFT JOIN (SELECT hash AS favorite_hash, COUNT(hash) AS count_favorite
                                                            FROM favorite_paths
                                                            GROUP BY hash) AS fp
                                                           ON fp.favorite_hash = p.hash
                                        WHERE p.hash = $hash;`, { $hash: hash });

		await sqlite.run(`DELETE
                      FROM paths
                      WHERE path LIKE $getPath || '%'`, {
			$getPath: item.path,
		});
		return item.path;
	}

	async sumFolderSize(sqlite: AsyncDatabase, folderPath: string) {
		const result: any = await sqlite.get(`SELECT SUM(size) AS sum_folder
                                          FROM paths
                                          WHERE path LIKE $getPath || '%'`, {
			$getPath: folderPath,
		});
		return result.sum_folder;
	}

	async getFavorites(sqlite: AsyncDatabase) {
		const result: Array<Properties> = [];
		const items: any = await sqlite.all(`SELECT hash,
                                                path,
                                                is_dir,
                                                name,
                                                size,
                                                mime_type,
                                                update_at,
                                                delete_time,
                                                count_delete   AS is_delete,
                                                count_favorite AS is_favorite,
                                                count_share    AS is_share
                                         FROM paths p
                                                  LEFT JOIN (SELECT hash AS delete_hash, COUNT(hash) AS count_delete, delete_time
                                                             FROM delete_paths
                                                             GROUP BY hash) AS dp
                                                            ON dp.delete_hash = p.hash
                                                  LEFT JOIN (SELECT hash AS favorite_hash, COUNT(hash) AS count_favorite
                                                             FROM favorite_paths
                                                             GROUP BY hash) AS fp
                                                            ON fp.favorite_hash = p.hash
                                                  LEFT JOIN (SELECT hash AS share_hash, COUNT(hash) AS count_share
                                                             FROM share_paths
                                                             GROUP BY hash) AS sh ON sh.share_hash = p.hash
                                         WHERE is_delete IS NULL
                                           AND is_favorite IS NOT NULL;`);

		for (const item of items) {
			if (item.is_dir)
				item.size = await this.sumFolderSize(sqlite, item.path);
			result.push({
				path: await this.utilService.clearPath(item.path),
				deleteAt: (item.delete_time) ? new Date(item.delete_time) : null,
				fileType: path.extname(item.name).replace('.', ''),
				hash: item.hash,
				sizeBytes: item.size,
				isDelete: Boolean(item.is_delete),
				isDir: Boolean(item.is_dir),
				isFavorite: Boolean(item.is_favorite),
				mimeType: item.mime_type,
				name: item.name,
				size: await this.utilService.convert(item.size),
				updateAt: new Date(item.update_at),
				isShare: Boolean(item.is_share),
			});
		}
		return result;
	}

	async setFavorite(sqlite: AsyncDatabase, key: string) {
		await sqlite.run(`INSERT INTO favorite_paths (hash)
                      VALUES ($hash)`, {
			$hash: key,
		});
	}

	async unsetFavorite(sqlite: AsyncDatabase, key: string) {
		await sqlite.run(`DELETE
                      FROM favorite_paths
                      WHERE hash = $hash`, {
			$hash: key,
		});
	}

	async getShareHash(sqlite: AsyncDatabase, token: string): Promise<string> {
		const hash: any = await sqlite.get(`SELECT hash
                                        FROM share_paths
                                        WHERE token = $token`, { $token: token });
		if (!hash)
			throw new NotFoundException('Файлом или папкой не поделились!');

		return hash.hash;
	}

	async getShareToken(sqlite: AsyncDatabase, hash: string): Promise<string> {
		const token: any = await sqlite.get(`SELECT token
                                         FROM share_paths
                                         WHERE hash = $hash`, { $hash: hash });
		if (!token)
			throw new NotFoundException('Файлом или папкой не поделились!');

		return token.token;
	}

	async setShare(sqlite: AsyncDatabase, key: string): Promise<string> {
		const token = v4();
		await sqlite.run(`INSERT INTO share_paths (hash, expire_at, token)
                      VALUES ($hash, $expire_at, $token)`, {
			$hash: key,
			$expire_at: (await this.utilService.addDays(new Date(), 30)).getTime(),
			$token: token,
		});
		return token;
	}

	async unsetShare(sqlite: AsyncDatabase, hash: string) {
		await sqlite.run(`DELETE
                      FROM share_paths
                      WHERE hash = $hash`, {
			$hash: hash,
		});
	}

	async sumSize(sqlite: AsyncDatabase): Promise<number> {
		const sum: any = await sqlite.get(`SELECT SUM(size) AS sum_size
                                       FROM paths`);
		return sum.sum_size;
	}

	async search(sqlite: AsyncDatabase, name: string) {
		const result: Array<Properties> = [];
		const items: any = await sqlite.all(`SELECT hash,
                                                path,
                                                is_dir,
                                                name,
                                                size,
                                                mime_type,
                                                update_at,
                                                delete_time,
                                                count_delete   AS is_delete,
                                                count_favorite AS is_favorite,
                                                count_share    AS is_share
                                         FROM paths p
                                                  LEFT JOIN (SELECT hash AS delete_hash, COUNT(hash) AS count_delete, delete_time
                                                             FROM delete_paths
                                                             GROUP BY hash) AS dp
                                                            ON dp.delete_hash = p.hash
                                                  LEFT JOIN (SELECT hash AS favorite_hash, COUNT(hash) AS count_favorite
                                                             FROM favorite_paths
                                                             GROUP BY hash) AS fp
                                                            ON fp.favorite_hash = p.hash
                                                  LEFT JOIN (SELECT hash AS share_hash, COUNT(hash) AS count_share
                                                             FROM share_paths
                                                             GROUP BY hash) AS sh ON sh.share_hash = p.hash
                                         WHERE name LIKE '%' || $name || '%'
                                           AND is_delete IS NULL;`, {
			$name: name,
		});

		for (const item of items) {
			if (item.is_dir)
				item.size = await this.sumFolderSize(sqlite, item.path);
			result.push({
				path: await this.utilService.clearPath(item.path),
				deleteAt: (item.delete_time) ? new Date(item.delete_time) : null,
				fileType: path.extname(item.name).replace('.', ''),
				hash: item.hash,
				sizeBytes: item.size,
				isDelete: Boolean(item.is_delete),
				isDir: Boolean(item.is_dir),
				isFavorite: Boolean(item.is_favorite),
				mimeType: item.mime_type,
				name: item.name,
				size: await this.utilService.convert(item.size),
				updateAt: new Date(item.update_at),
				isShare: Boolean(item.is_share),
			});
		}

		return result;
	}
}
