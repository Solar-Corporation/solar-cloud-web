import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { Transaction } from 'sequelize';

import { FileService as RsFileService, FsItem } from '../../../index';
import { UserDto } from '../user/dto/user.dto';
import { TrashDatabaseService } from './trash-database.service';

@Injectable()
export class TrashService {
	private readonly basePath;

	constructor(
		private readonly trashDatabaseService: TrashDatabaseService,
		private readonly configService: ConfigService,
	) {
		this.basePath = this.configService.get('app.path');
	}

	async getDeleteFiles({ uuid }: UserDto): Promise<Array<FsItem>> {
		const paths = await this.trashDatabaseService.getDeleteFiles(uuid);
		return await RsFileService.getFilesMetadata(paths, true);
	}

	async restoreDeleteFiles({ uuid }: UserDto, paths: Array<string>, transaction: Transaction): Promise<void> {
		const restorePaths = paths.map(deletePath => path.join(this.basePath, uuid, deletePath));
		await this.trashDatabaseService.restoreDeleteFiles(restorePaths, transaction);
		await RsFileService.restoreDeletePaths(restorePaths);
	}

	async deletePaths({ uuid }: UserDto, transaction: Transaction): Promise<void> {
		const paths = await this.trashDatabaseService.deleteFiles(uuid, transaction);
		await RsFileService.deletePaths(paths);
	}
}

