import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import * as fse from 'fs-extra';
import { FileSystemStoredFile } from 'nestjs-form-data';
import path from 'path';
import { Readable } from 'stream';
import { COMPRESSION_LEVEL, zip } from 'zip-a-folder';

import { BucketDatabaseService } from './bucket-database.service';
import { Bucket, BucketService, Space } from './bucket.service';
import { UtilService } from './util.service';

export type Properties = {
	name: string;
	hash: string;
	path: string;
	isDir: boolean;
	fileType: string;
	mimeType: string;
	size: string;
	sizeBytes: number;
	isFavorite: boolean;
	isDelete: boolean;
	deleteAt: Date | null;
	updateAt: Date;
	isShare?: boolean;
}

export type StreamFile = {
	fileMime: string;
	name: string;
	stream: Readable;
}

export type HashPath = {
	name: string,
	hash: string
}

@Injectable()
export class ItemService {
	constructor(
		private readonly bucketService: BucketService,
		private readonly bucketDbService: BucketDatabaseService,
		private readonly utilService: UtilService,
	) {
	}

	async addFiles(bucket: Bucket, key: string, files: Array<FileSystemStoredFile>) {
		const sqlite = await this.bucketDbService.open(bucket.path);
		try {
			const folderPath = await this.bucketDbService.get(sqlite, key);
			const savePath = (folderPath) ? path.join(bucket.path, 'files', folderPath.path) : path.join(bucket.path, 'files');

			for (const file of files) {
				await sqlite.exec('BEGIN');

				const { size, originalName, mimeType, buffer }: any = file;
				await this.bucketService.increaseUsageSpace(bucket, size);
				const filePath = path.join(savePath, originalName);

				if (await this.utilService.isExist(filePath))
					throw new ConflictException(`Файл c именем ${originalName} уже существует!`);

				if (size > 1073741824)
					throw new ConflictException(`Размер файла ${originalName} превышает 1 гигабайт!`);

				await this.bucketDbService.add(sqlite, {
					hash: createHash('md5').update(path.join(filePath, '/')).digest('hex'),
					isDir: 0,
					mimeType: mimeType,
					name: originalName,
					path: path.join(filePath, '/'),
					updateAt: (new Date()).getTime(),
					size: size,
				});
				await fs.writeFile(filePath, buffer);
				await sqlite.exec('COMMIT');
			}
			await sqlite.close();
		} catch (err) {
			await sqlite.exec('ROLLBACK');
			await sqlite.close();
			throw err;
		}
	}

	async addDir(bucket: Bucket, key: string, name: string): Promise<string> {
		const sqlite = await this.bucketDbService.open(bucket.path);
		try {
			await sqlite.exec('BEGIN');
			const folderPath = await this.bucketDbService.get(sqlite, key);
			const savePath = (folderPath) ? path.join(bucket.path, 'files', folderPath.path, name) : path.join(bucket.path, 'files', name);

			if (folderPath?.isDelete)
				throw new ConflictException(`Папка c именем ${name} находится в корзине!`);

			if (await this.utilService.isExist(savePath))
				throw new ConflictException(`Папка c именем ${name} уже существует!`);

			const hash = createHash('md5').update(path.join(savePath, '/')).digest('hex');

			await this.bucketDbService.add(sqlite, {
				hash,
				isDir: 1,
				mimeType: '',
				name: name,
				path: path.join(savePath, '/'),
				updateAt: (new Date()).getTime(),
				size: 0,
			});
			await fs.mkdir(savePath);

			await sqlite.exec('COMMIT');
			await sqlite.close();

			return hash;
		} catch (err) {
			await sqlite.exec('ROLLBACK');
			await sqlite.close();

			throw err;
		}
	}

	async rename(bucket: Bucket, key: string, name: string) {
		const sqlite = await this.bucketDbService.open(bucket.path);
		try {
			await sqlite.exec('BEGIN');
			const item = await this.bucketDbService.get(sqlite, key);
			if (!item)
				throw new NotFoundException(`Элемента с таким именем не существует!`);

			const oldPath = path.join(bucket.path, 'files', item.path);
			const newPath = await this.utilService.replaceLast(oldPath, item.name, name);

			await this.bucketDbService.updatePath(sqlite, oldPath, newPath);

			await fs.rename(oldPath, newPath);

			await sqlite.exec('COMMIT');
			await sqlite.close();
		} catch (err) {
			await sqlite.exec('ROLLBACK');
			await sqlite.close();
			throw err;
		}
	}

	async move(bucket: Bucket, keyFrom: string, keyTo: string) {
		const sqlite = await this.bucketDbService.open(bucket.path);
		try {
			await sqlite.exec('BEGIN');
			const itemFrom = await this.bucketDbService.get(sqlite, keyFrom);

			if (!itemFrom)
				throw new NotFoundException(`Элемента с таким именем не существует!`);

			if (itemFrom.isDelete)
				throw new ConflictException(`Элемент c именем ${itemFrom.name} находится в корзине!`);

			const itemTo = await this.bucketDbService.get(sqlite, keyTo);

			if ((!itemTo || !itemTo.isDir) && keyTo)
				throw new NotFoundException(`Папки с таким именем не существует!`);

			if (itemTo?.isDelete)
				throw new ConflictException(`Папка c именем ${itemTo.name} находится в корзине!`);

			const fromPath = path.join(bucket.path, 'files', itemFrom.path);
			let toPath = path.join(bucket.path, 'files', (itemTo) ? itemTo.path : '', itemFrom.name, (itemFrom.isDir) ? '/' : '');

			await this.bucketDbService.updatePath(sqlite, fromPath, toPath);

			await fse.move(fromPath, toPath);

			await sqlite.exec('COMMIT');
			await sqlite.close();
		} catch (err) {
			await sqlite.exec('ROLLBACK');
			await sqlite.close();
			throw err;
		}
	}

	async copy(bucket: Bucket, keyFrom: string, keyTo: string) {
		const sqlite = await this.bucketDbService.open(bucket.path);
		try {
			await sqlite.exec('BEGIN');
			const itemFrom = await this.bucketDbService.get(sqlite, keyFrom);

			if (!itemFrom)
				throw new NotFoundException(`Элемента с таким именем не существует!`);

			if (itemFrom.isDelete)
				throw new ConflictException(`Элемент c именем ${itemFrom.name} находится в корзине!`);

			const itemTo = await this.bucketDbService.get(sqlite, keyTo);

			if ((!itemTo || !itemTo.isDir) && keyTo)
				throw new NotFoundException(`Папки с таким именем не существует!`);

			if (itemTo?.isDelete)
				throw new ConflictException(`Папка c именем ${itemTo.name} находится в корзине!`);

			const fromPath = path.join(bucket.path, 'files', itemFrom.path);
			let toPath = path.join(bucket.path, 'files', (itemTo) ? itemTo.path : '', (itemTo?.isDir) ? '/' : '');

			await this.bucketDbService.copyPath(sqlite, fromPath, toPath);

			await fse.copy(fromPath, path.join(toPath, itemFrom.name));

			await sqlite.exec('COMMIT');
			await sqlite.close();
		} catch (err) {
			await sqlite.exec('ROLLBACK');
			await sqlite.close();
			throw err;
		}
	}

	async getItems(bucket: Bucket, key: string): Promise<Array<Properties>> {
		const sqlite = await this.bucketDbService.open(bucket.path);
		const folderPath = await this.bucketDbService.get(sqlite, key);
		if (!folderPath && key)
			throw new NotFoundException(`Папки не существует!`);

		if (folderPath?.isDelete)
			throw new ConflictException(`Папка c именем ${folderPath?.name} находится в корзине!`);
		const getPath = (folderPath) ? path.join(bucket.path, 'files', folderPath.path, '/') : path.join(bucket.path, 'files', '/');
		const properties = await this.bucketDbService.getItems(sqlite, getPath);
		await sqlite.close();

		return properties;
	}

	async getFile(bucket: Bucket, key: string): Promise<StreamFile> {
		const sqlite = await this.bucketDbService.open(bucket.path);
		const folderPath = await this.bucketDbService.get(sqlite, key);
		if (!folderPath)
			throw new NotFoundException(`Папки или файла не существует!`);

		if (folderPath.isDelete)
			throw new ConflictException(`Папка или файла c именем ${folderPath?.name} находится в корзине!`);

		let file;
		const getPath = path.join(bucket.path, 'files', folderPath.path);
		if (folderPath.isDir) {
			folderPath.name = path.basename(folderPath.path) + '.zip';
			const zipPath = path.join(path.dirname(getPath), folderPath.name);
			await zip(getPath, zipPath, { compression: COMPRESSION_LEVEL.uncompressed });
			file = await fs.readFile(zipPath);
			await fs.rm(getPath + '.zip', { recursive: true, force: true });
		} else {
			file = await fs.readFile(getPath);
		}

		return {
			fileMime: folderPath.mimeType,
			stream: Readable.from(file),
			name: folderPath.name,
		};
	}

	async setDelete(bucket: Bucket, key: string) {
		const sqlite = await this.bucketDbService.open(bucket.path);
		try {
			await sqlite.exec('BEGIN');
			const folderPath = await this.bucketDbService.get(sqlite, key);
			if (!folderPath)
				throw new NotFoundException(`Папки или файла не существует!`);

			if (folderPath.isDelete)
				throw new ConflictException(`Папка или файла c именем ${folderPath?.name} находится в корзине!`);

			await this.bucketDbService.setDelete(sqlite, key);

			await sqlite.exec('COMMIT');
			await sqlite.close();
		} catch (err) {
			await sqlite.exec('ROLLBACK');
			await sqlite.close();
			throw err;
		}
	}


	async unsetDelete(bucket: Bucket, key: string) {
		const sqlite = await this.bucketDbService.open(bucket.path);
		try {
			await sqlite.exec('BEGIN');
			const folderPath = await this.bucketDbService.get(sqlite, key);
			if (!folderPath)
				throw new NotFoundException(`Папки или файла не существует!`);

			await this.bucketDbService.unsetDelete(sqlite, key);
			await sqlite.exec('COMMIT');
			await sqlite.close();
		} catch (err) {
			await sqlite.exec('ROLLBACK');
			await sqlite.close();
			throw err;
		}
	}

	async getDeletes(bucket: Bucket): Promise<Array<Properties>> {
		const sqlite = await this.bucketDbService.open(bucket.path);
		return await this.bucketDbService.getDeletes(sqlite);
	}

	async remove(bucket: Bucket, hashes: Array<string>) {

		const sqlite = await this.bucketDbService.open(bucket.path);
		try {
			for (const hash of hashes) {
				await sqlite.exec('BEGIN');

				const folderPath = await this.bucketDbService.get(sqlite, hash);
				if (!folderPath)
					throw new NotFoundException(`Папки или файла не существует!`);

				const deletePath = await this.bucketDbService.remove(sqlite, hash);
				if (await this.utilService.isExist(deletePath)) {
					await fs.rm(deletePath, { recursive: true, force: true });
					const size = await this.bucketDbService.sumSize(sqlite);
					await this.bucketService.decreaseUsageSpace(bucket, size);
				}


				await sqlite.exec('COMMIT');
			}
			await sqlite.close();
		} catch (err) {
			await sqlite.exec('ROLLBACK');
			await sqlite.close();
			throw err;
		}
	}

	async clearTrash(bucket: Bucket) {
		const deleteFiles = await this.getDeletes(bucket);
		const hashes = [];
		for (const file of deleteFiles)
			hashes.push(file.hash);
		await this.remove(bucket, hashes);
	}

	async setFavorite(bucket: Bucket, key: string) {
		const sqlite = await this.bucketDbService.open(bucket.path);
		try {
			await sqlite.exec('BEGIN');
			const folderPath = await this.bucketDbService.get(sqlite, key);
			if (!folderPath)
				throw new NotFoundException(`Папки или файла не существует!`);

			if (folderPath.isDelete)
				throw new ConflictException(`Папка или файла c именем ${folderPath?.name} находится в корзине!`);

			await this.bucketDbService.setFavorite(sqlite, key);

			await sqlite.exec('COMMIT');
			await sqlite.close();
		} catch (err) {
			await sqlite.exec('ROLLBACK');
			await sqlite.close();
			throw err;
		}
	}

	async unsetFavorite(bucket: Bucket, key: string) {
		const sqlite = await this.bucketDbService.open(bucket.path);
		try {
			await sqlite.exec('BEGIN');
			const folderPath = await this.bucketDbService.get(sqlite, key);
			if (!folderPath)
				throw new NotFoundException(`Папки или файла не существует!`);

			await this.bucketDbService.unsetFavorite(sqlite, key);

			await sqlite.exec('COMMIT');
			await sqlite.close();
		} catch (err) {
			await sqlite.exec('ROLLBACK');
			await sqlite.close();
			throw err;
		}
	}

	async getFavorites(bucket: Bucket): Promise<Array<Properties>> {
		const sqlite = await this.bucketDbService.open(bucket.path);
		return await this.bucketDbService.getFavorites(sqlite);
	}

	async setShare(bucket: Bucket, key: string): Promise<string> {
		const sqlite = await this.bucketDbService.open(bucket.path);
		try {
			await sqlite.exec('BEGIN');
			const folderPath = await this.bucketDbService.get(sqlite, key);
			if (!folderPath)
				throw new NotFoundException(`Папки или файла не существует!`);

			if (folderPath.isDelete)
				throw new ConflictException(`Папка или файла c именем ${folderPath?.name} находится в корзине!`);

			const token = await this.bucketDbService.setShare(sqlite, key);

			await sqlite.exec('COMMIT');
			await sqlite.close();
			return token;
		} catch (err) {
			await sqlite.exec('ROLLBACK');
			await sqlite.close();
			throw err;
		}
	}

	async unsetShare(bucket: Bucket, key: string) {
		const sqlite = await this.bucketDbService.open(bucket.path);
		try {
			await sqlite.exec('BEGIN');
			const folderPath = await this.bucketDbService.get(sqlite, key);
			if (!folderPath)
				throw new NotFoundException(`Папки или файла не существует!`);

			await this.bucketDbService.unsetShare(sqlite, key);

			await sqlite.exec('COMMIT');
			await sqlite.close();
		} catch (err) {
			await sqlite.exec('ROLLBACK');
			await sqlite.close();
			throw err;
		}
	}

	async getShareToken(bucket: Bucket, hash: string): Promise<string> {
		const sqlite = await this.bucketDbService.open(bucket.path);
		return await this.bucketDbService.getShareToken(sqlite, hash);
	}

	async getShareHash(bucket: Bucket, token: string): Promise<string> {
		const sqlite = await this.bucketDbService.open(bucket.path);
		return await this.bucketDbService.getShareHash(sqlite, token);
	}

	async getPath(bucket: Bucket, hash: string): Promise<Array<HashPath>> {
		const sqlite = await this.bucketDbService.open(bucket.path);
		const pathFolder = await this.bucketDbService.get(sqlite, hash);
		if (!pathFolder || !pathFolder.isDir)
			throw new NotFoundException(`Папки не существует!`);

		if (pathFolder.isDelete)
			throw new ConflictException(`Папка c именем ${pathFolder.name} находится в корзине!`);

		let concatPath = '';
		const paths = pathFolder.path.split('/');
		const fullPath = [];
		for (const pathDir of paths) {
			concatPath = path.join(concatPath, pathDir, '/');
			fullPath.push({
				name: pathDir,
				hash: createHash('md5').update(path.join(bucket.path, 'files', concatPath)).digest('hex'),
			});
		}
		return fullPath;
	}

	async getSpace(bucket: Bucket): Promise<Space> {
		const { usageSpace, totalSpace } = bucket;
		return {
			percent: Number((usageSpace / totalSpace * 100).toFixed(2)),
			totalSpace: await this.utilService.convert(totalSpace),
			usageSpace: await this.utilService.convert(usageSpace),
		};
	}
}
