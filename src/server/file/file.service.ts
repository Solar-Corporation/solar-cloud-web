import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BucketService, Space } from '../s3/bucket.service';
import { HashPath, ItemService, Properties, StreamFile } from '../s3/item.service';
import { StorageService } from '../s3/storage.service';

import { UserDto } from '../user/dto/user.dto';
import { FileUploadDto, MovePath } from './dto/file.dto';

@Injectable()
export class FileService {

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

	async saveFile(fileUploadDto: FileUploadDto, { uuid }: UserDto): Promise<void> {
		const { files, hash, dir } = fileUploadDto;

		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);
		const key = (dir) ? await this.itemService.addDir(bucket, hash, dir) : hash;

		await this.itemService.addFiles(bucket, key, files);
	}

	async getFile({ uuid }: UserDto, hash: string): Promise<StreamFile> {
		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);
		return await this.itemService.getFile(bucket, hash);
	}

	async rename({ uuid }: UserDto, hash: string, name: string): Promise<void> {
		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);
		await this.itemService.rename(bucket, hash, name);
	}

	async getFileTree({ uuid }: UserDto, hash: string): Promise<Array<Properties>> {
		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);
		return await this.itemService.getItems(bucket, hash);
	}


	async delete({ uuid }: UserDto, hashes: Array<string>): Promise<void> {
		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);
		for (const hash of hashes)
			await this.itemService.setDelete(bucket, hash);
	}

	async createDir({ uuid }: UserDto, hash: string, name: string): Promise<string> {
		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);
		return await this.itemService.addDir(bucket, hash, name);
	}


	async moveFiles({ uuid }: UserDto, movePaths: Array<MovePath>): Promise<void> {
		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);
		for (const { hashFrom, hashTo } of movePaths) {

			if (hashFrom === hashTo)
				throw new ConflictException('Пути должны отличаться!');

			await this.itemService.move(bucket, hashFrom, hashTo);
		}
	}

	async copyFiles({ uuid }: UserDto, movePaths: Array<MovePath>): Promise<void> {
		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);
		for (const { hashFrom, hashTo } of movePaths) {

			if (hashFrom === hashTo)
				throw new ConflictException('Пути должны отличаться!');

			await this.itemService.copy(bucket, hashFrom, hashTo);
		}
	}

	async getPath({ uuid }: UserDto, hash: string): Promise<Array<HashPath>> {
		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);
		return await this.itemService.getPath(bucket, hash);
	}

	async getSpace({ uuid }: UserDto): Promise<Space> {
		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);
		return await this.itemService.getSpace(bucket);
	}
}
