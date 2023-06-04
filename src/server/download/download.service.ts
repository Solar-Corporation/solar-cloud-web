import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { UtilService } from '../s3/util.service';
import { DownloadDto } from './dto/download.dto';

@Injectable()
export class DownloadService {
	private readonly basePath;

	constructor(
		private readonly configService: ConfigService,
		private readonly utilService: UtilService,
	) {
		this.basePath = this.configService.get('app.path');
	}

	async download(file: DownloadDto, res: Response) {
		const downloadPath = path.join(this.basePath, 'temp', file.token, file.name);
		if (!await this.utilService.isExist(downloadPath))
			throw new NotFoundException('Файл не найден!');
		res.download(downloadPath, decodeURIComponent(file.name));
	}

	@Cron('*/1 * * * *', {
		name: 'deleteFile',
		timeZone: 'Europe/Moscow',
	})
	async deleteFiles() {
		const tempPath = path.join(this.basePath, 'temp');

		const itemsPath = await fs.readdir(tempPath);
		for (const itemPath of itemsPath) {
			const item = await fs.stat(path.join(tempPath, itemPath));
			if (item.birthtime < new Date())
				await fs.rm(path.join(tempPath, itemPath), { recursive: true, force: true });
		}
	}
}
