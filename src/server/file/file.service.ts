import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { Transaction } from 'sequelize';
import { Readable } from 'stream';

import { FileService as RsFileService, FileTree, UserFile } from '../../../index';
import { UserDto } from '../user/dto/user.dto';
import { FileDto, FileUploadDto, RenameDto } from './dto/file.dto';
import { FileDatabaseService } from './file-database.service';

@Injectable()
export class FileService {

	constructor(
		private readonly fileDatabaseService: FileDatabaseService,
		private readonly configService: ConfigService,
	) {
	}

	async saveFile(fileUploadDto: FileUploadDto, userDto: UserDto): Promise<void> {
		const { file: { buffer, originalName }, filePath } = fileUploadDto;
		const storePath = this.configService.get('app.path');

		const userFile: UserFile = {
			filePath: path.join(storePath, userDto.uuid, filePath, originalName),
			buffer: buffer,
		};

		await RsFileService.saveFile(userFile, userDto.uuid, storePath);
	}

	async getFile(shortFilePath: string, userDto: UserDto): Promise<FileDto> {
		const storePath = this.configService.get('app.path');
		const fullFilePath = path.join(storePath, userDto.uuid, shortFilePath);

		const userFile = await RsFileService.getFile(fullFilePath);
		return {
			fileMime: userFile.mimeType!,
			filePath: shortFilePath,
			isDelete: false,
			name: path.basename(fullFilePath),
			sizeActual: userFile.size!,
			stream: Readable.from(userFile.buffer)!,
			type: path.extname(fullFilePath),
			updateAt: new Date(userFile.seeTime!),
		};
	}

	async renameFile(renameFileDto: RenameDto, userDto: UserDto, transaction: Transaction): Promise<void> {
		const storePath = this.configService.get('app.path');
		const fullPath = path.join(storePath, userDto.uuid, renameFileDto.path);
		const renameFilePath = fullPath.replace(path.basename(fullPath), renameFileDto.newName);
		await this.fileDatabaseService.updateFilePath({ path: fullPath, newName: renameFilePath }, transaction);
		await RsFileService.rename(fullPath, renameFilePath);
	}

	async getFileTree(userDto: UserDto, filePath: string): Promise<Array<FileTree>> {
		const { uuid } = userDto;
		const basePath = this.configService.get('app.path');
		const userFilesPath = path.join(basePath, userDto.uuid, filePath);
		return await RsFileService.getFileTree(userFilesPath, path.join(basePath, uuid));
	}

}
