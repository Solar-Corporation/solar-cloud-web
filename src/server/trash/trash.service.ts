import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BucketService } from '../s3/bucket.service';
import { ItemService, Properties } from '../s3/item.service';
import { StorageService } from '../s3/storage.service';

import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class TrashService {
	private readonly basePath;
	private readonly baseName;

	constructor(
		private readonly itemService: ItemService,
		private readonly bucketService: BucketService,
		private readonly configService: ConfigService,
		private readonly storageService: StorageService,
	) {
		this.basePath = this.configService.get('app.path');
		this.baseName = this.configService.get('app.name');
	}

	async getDeleteFiles({ uuid }: UserDto): Promise<Array<Properties>> {
		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);
		return await this.itemService.getDeletes(bucket);
	}

	async restoreDeleteFiles({ uuid }: UserDto, hashes: Array<string>): Promise<void> {
		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);
		for (const hash of hashes)
			await this.itemService.unsetDelete(bucket, hash);
	}

	async deletePaths({ uuid }: UserDto): Promise<void> {
		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);
		await this.itemService.clearTrash(bucket);
	}
}

