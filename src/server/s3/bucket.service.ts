import { ConflictException, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import path from 'path';

import { BucketDatabaseService } from './bucket-database.service';
import { StorageService, Store } from './storage.service';
import { UtilService } from './util.service';

export type Bucket = {
	uuid: string,
	path: string,
	totalSpace: number,
	store: Store,
	usageSpace: number,
}

export type Space = {
	percent: number,
	totalSpace: string,
	usageSpace: string,
}

@Injectable()
export class BucketService {
	constructor(
		private readonly utilService: UtilService,
		private readonly bucketDbService: BucketDatabaseService,
		private readonly storeService: StorageService,
	) {
	}

	async create(store: Store, uuid: string, space: number): Promise<Bucket> {
		if (store.usageSpace + space > store.totalSpace)
			throw new ConflictException('Не хватает места на диске!');

		const bucketPath = path.join(store.path, uuid);
		await fs.mkdir(bucketPath);
		await fs.mkdir(path.join(bucketPath, 'files'));

		const bucket: Bucket = {
			uuid: uuid,
			path: bucketPath,
			totalSpace: space,
			store: store,
			usageSpace: 0,
		};

		await fs.writeFile(path.join(bucketPath, 'bucket.json'), JSON.stringify(bucket));
		const sqlite = await this.bucketDbService.open(bucketPath);
		await sqlite.close();

		return bucket;
	}

	async open(store: Store, uuid: string): Promise<Bucket> {
		const storePath = path.join(store.path, uuid);
		if (!await this.utilService.isExist(storePath))
			await this.create(store, uuid, 10737418240);

		const bucket = await fs.readFile(path.join(storePath, 'bucket.json'));

		return JSON.parse(bucket.toString('utf-8'));
	}

	async delete(store: Store, uuid: string) {
		const storePath = path.join(store.path, uuid);
		if (!await this.utilService.isExist(storePath))
			return;

		const bucketPath = path.join(store.path, uuid);
		await fs.rm(bucketPath, { recursive: true, force: true });
	}

	async updateTotalSpace(bucket: Bucket, totalSpace: number): Promise<Bucket> {
		if (totalSpace < bucket.usageSpace)
			throw new ConflictException('Не хватает места в хранилище!',
				'Перед уменьшением размера хранилища требуется удалить лишние файлы.');

		bucket.totalSpace = totalSpace;

		await fs.writeFile(path.join(bucket.path, 'bucket.json'), JSON.stringify(bucket));

		return bucket;
	}

	async increaseUsageSpace(bucket: Bucket, space: number): Promise<Bucket> {
		const usageSpace = bucket.usageSpace + space;
		if (usageSpace > bucket.totalSpace)
			throw new ConflictException('Не хватает места в хранилище!');

		bucket.usageSpace = usageSpace;

		await fs.writeFile(path.join(bucket.path, 'bucket.json'), JSON.stringify(bucket));
		await this.storeService.increaseUsageSpace(bucket.store, space);

		return bucket;
	}

	async decreaseUsageSpace(bucket: Bucket, space: number): Promise<Bucket> {
		const decreaseSpace = space - bucket.usageSpace;
		bucket.usageSpace = space;

		await fs.writeFile(path.join(bucket.path, 'bucket.json'), JSON.stringify(bucket));
		await this.storeService.decreaseUsageSpace(bucket.store, decreaseSpace);

		return bucket;
	}

}
