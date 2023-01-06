import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { Transaction } from 'sequelize';
import { Readable } from 'stream';

import { FileService as RsFileService, FsItem, UserFile } from '../../../solar-s3';
import { UserDto } from '../user/dto/user.dto';
import { DirCreateDto, FileDto, FileUploadDto, MovePath, RenameDto } from './dto/file.dto';
import { FileDatabaseService } from './file-database.service';

@Injectable()
export class FileService {

	private readonly basePath;

	constructor(
		private readonly fileDatabaseService: FileDatabaseService,
		private readonly configService: ConfigService,
	) {
		this.basePath = this.configService.get('app.path');
	}

	async saveFile(fileUploadDto: FileUploadDto, { uuid }: UserDto): Promise<void> {
		const { files, path: filePath } = fileUploadDto;
		for (const file of files) {

			const { buffer, originalName }: any = file;

			const userFile: UserFile = {
				filePath: path.join(this.basePath, uuid, filePath, originalName),
				buffer: buffer,
			};

			await RsFileService.saveFile(userFile, uuid, this.basePath);
		}
	}

	async getFile(shortFilePath: string, { uuid }: UserDto): Promise<FileDto> {
		const fullFilePath = path.join(this.basePath, uuid, shortFilePath);

		const userFile = await RsFileService.getFile(fullFilePath);
		return {
			fileMime: userFile.mimeType!,
			filePath: shortFilePath,
			isDelete: false,
			name: path.basename(fullFilePath),
			sizeActual: userFile.size!,
			stream: Readable.from(userFile.buffer!),
			type: path.extname(fullFilePath),
			updateAt: new Date(userFile.seeTime!),
		};
	}

	async rename({ path: renamePath, newName }: RenameDto, { uuid }: UserDto, transaction: Transaction): Promise<void> {
		const fullPath = path.join(this.basePath, uuid, renamePath);
		const renameFilePath = fullPath.replace(path.basename(fullPath), newName);

		await this.fileDatabaseService.updateFilePath({ path: fullPath, newName: renameFilePath }, transaction);

		await RsFileService.rename(fullPath, renameFilePath);
	}

	async getFileTree({ uuid }: UserDto, filePath: string): Promise<Array<FsItem>> {
		const userFilePath = path.join(this.basePath, uuid, filePath);
		return await RsFileService.getDirItems(userFilePath);
	}

	async delete({ uuid }: UserDto, deletePaths: Array<string>, transaction: Transaction): Promise<void> {
		for (const deletePath of deletePaths) {
			const fullPath = path.join(this.basePath, uuid, path.normalize(deletePath));

			if (fullPath === path.join(this.basePath, uuid, '/'))
				throw new ConflictException('You cannot remove the root directory!');

			const deleteMarked = await RsFileService.markAsDelete(fullPath);
			const deleteDate = new Date(deleteMarked.time);
			deleteMarked.time = new Date(deleteDate.setDate(deleteDate.getDate() + 30));

			await this.fileDatabaseService.markAsDelete(deleteMarked, transaction);
		}
	}

	async createDir({ uuid }: UserDto, dirCreate: DirCreateDto): Promise<void> {
		const dirPath = path.join(this.basePath, uuid, dirCreate.path, dirCreate.name);
		await RsFileService.createDir(dirPath);
	}

	async moveFiles({ uuid }: UserDto, movePaths: Array<MovePath>, transaction: Transaction): Promise<void> {
		for (const { pathFrom, pathTo } of movePaths) {
			const fullPathFrom = path.join(this.basePath, uuid, pathFrom);
			const fullPathTo = path.join(this.basePath, uuid, pathTo);

			if (fullPathFrom === fullPathTo)
				throw new ConflictException('Paths must be different!');

			await this.fileDatabaseService.updateFilePath({
				path: path.parse(fullPathFrom).dir,
				newName: fullPathTo,
			}, transaction);

			await RsFileService.movePath(fullPathFrom, fullPathTo);
		}
	}
}
