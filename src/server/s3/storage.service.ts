import { ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import path from 'path';
import { UtilService } from './util.service';

export type Store = {
	uuid: string;
	path: string;
	totalSpace: number;
	usageSpace: number;
}

@Injectable()
export class StorageService implements OnModuleInit {

	constructor(
		private readonly utilService: UtilService,
		private readonly configService: ConfigService,
	) {
	}

	async onModuleInit() {
		const basePath = this.configService.get('app.path');
		const name = this.configService.get('app.name');
		await this.create(basePath, name, 107374182400);
	}

	async create(pathDir: string, uuid: string, space: number): Promise<Store> {
		const discSpace = 1099511627776;
		if (discSpace - space <= 0)
			throw new ConflictException('Не хватает места на диске!');

		const storePath = path.join(pathDir, uuid);
		if (await this.utilService.isExist(storePath))
			return await this.open(pathDir, uuid);


		await fs.mkdir(storePath);

		const store: Store = {
			uuid: uuid,
			path: storePath,
			totalSpace: space,
			usageSpace: 0,
		};

		await fs.writeFile(path.join(storePath, 'storage.json'), JSON.stringify(store));

		return store;
	}

	async open(pathDir: string, uuid: string): Promise<Store> {
		const storePath = path.join(pathDir, uuid, 'storage.json');

		if (!await this.utilService.isExist(storePath))
			throw new NotFoundException('Хранилище не существует!');

		const store = await fs.readFile(storePath);

		return JSON.parse(store.toString('utf-8'));
	}

	async increaseUsageSpace(store: Store, space: number): Promise<Store> {
		const usageSpace = store.usageSpace + space;
		if (usageSpace > store.totalSpace)
			throw new ConflictException('Не хватает места на диске!');

		store.usageSpace = usageSpace;

		await fs.writeFile(path.join(store.path, 'storage.json'), JSON.stringify(store));

		return store;
	}

	async decreaseUsageSpace(store: Store, space: number): Promise<Store> {
		store.usageSpace = store.usageSpace - space;

		await fs.writeFile(path.join(store.path, 'storage.json'), JSON.stringify(store));

		return store;
	}
}
