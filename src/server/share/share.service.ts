import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BucketService } from '../s3/bucket.service';
import { ItemService, StreamFile } from '../s3/item.service';
import { StorageService } from '../s3/storage.service';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class ShareService {
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

	async addShare({ uuid }: UserDto, hash: string): Promise<string> {
		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);
		return await this.itemService.setShare(bucket, hash);
	}

	async deleteShare({ uuid }: UserDto, hash: string) {
		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);
		await this.itemService.unsetShare(bucket, hash);
	}

	async getShareToken({ uuid }: UserDto, hash: string): Promise<string> {
		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);
		return await this.itemService.getShareToken(bucket, hash);
	}

	async getFile(uuid: string, token: string): Promise<StreamFile> {
		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);
		const hash = await this.itemService.getShareHash(bucket, token);
		return await this.itemService.getFile(bucket, hash);
	}
}
