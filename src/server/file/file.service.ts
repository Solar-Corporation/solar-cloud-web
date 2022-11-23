import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import path from 'path';
import { Transaction } from 'sequelize';
import { Readable } from 'stream';

import { FileSystem } from '../../../index';
import { IFile } from '../../shared/interfaces/file.interface';
import { FileTree } from '../../shared/types/file.type';
import { UserDto } from '../user/dto/user.dto';
import { FileDto, FileUploadDto, RenameFileDto } from './dto/file.dto';
import { FileDatabaseService } from './file-database.service';

@Injectable()
export class FileService implements IFile {

	constructor(
		private readonly fileDatabaseService: FileDatabaseService,
		private readonly configService: ConfigService,
	) {
	}

	async saveFile(fileUploadDto: FileUploadDto, userDto: UserDto, transaction: Transaction): Promise<number> {
		const { file: { size, buffer, originalName, mimeType }, filePath } = fileUploadDto;
		const storePath = this.configService.get('app.path');

		const fileDto: FileDto = {
			filePath: path.join(storePath, userDto.uuid, filePath, originalName),
			sizeActual: size,
			sizeCompressed: size,
			fileMime: mimeType,
		};

		const isExist = await FileSystem.isFileExist(fileDto.filePath);
		if (isExist)
			throw new ConflictException('File already exist!', 'Please rename, file');

		const fileId = await this.fileDatabaseService.addFile(fileDto, userDto.id, transaction);
		await FileSystem.saveFile(buffer, fileDto.filePath);
		return fileId;
	}

	async getFile(shortFilePath: string, userDto: UserDto): Promise<FileDto> {
		const storePath = this.configService.get('app.path');
		const fullFilePath = path.join(storePath, userDto.uuid, shortFilePath);

		const isExist = await FileSystem.isFileExist(fullFilePath);
		if (!isExist)
			throw new NotFoundException('File doesn\'t exist!', 'File doesn\'t exist!');

		const fileDto = await this.fileDatabaseService.getFile(fullFilePath);
		const buffer = await FileSystem.getFile(fullFilePath);
		fileDto.stream = Readable.from(buffer) as Readable;

		fileDto.type = path.extname(fullFilePath);
		fileDto.name = path.basename(fullFilePath);

		return fileDto;
	}

	async renameFile(renameFileDto: RenameFileDto, userDto: UserDto, transaction: Transaction): Promise<void> {
		const storePath = this.configService.get('app.path');
		const fullPath = path.join(storePath, userDto.uuid, renameFileDto.filePath);

		const isExist = await FileSystem.isFileExist(fullPath);
		if (!isExist)
			throw new NotFoundException('File doesn\'t exist!', 'File doesn\'t exist!');

		const renameFilePath = fullPath.replace(path.basename(fullPath), renameFileDto.newName);
		await this.fileDatabaseService.updateFilePath({ filePath: fullPath, newName: renameFilePath }, transaction);

		await FileSystem.rename(fullPath, renameFilePath);
	}

	async getFileTree(userDto: UserDto): Promise<FileTree> {
		const storePath = this.configService.get('app.path');
		const userFilesPath = path.join(storePath, userDto.uuid);
		return await this.getDirTree(userFilesPath);
	}

	private async getDirTree(dirPath: string, fileTree =
		{
			name: '/',
			path: '/',
			isFolder: true,
			expand: true,
			children: [],
		}, root: string | null = null,
	): Promise<FileTree> {
		const list: Array<string> = await fs.readdir(dirPath);
		for (let item of list) {

			const itemPath = path.join(dirPath, item);
			let stats = await fs.stat(itemPath);
			const rootPath = (root) ? path.join(root, item) : item;

			if (stats.isDirectory()) {
				const directoryChildren: FileTree = {
					name: item,
					path: rootPath,
					isFolder: true,
					expand: false,
					children: [],
				};

				fileTree.children.push(directoryChildren);
				const childrenIndex: number = fileTree.children.length - 1;
				await this.getDirTree(itemPath, fileTree.children[childrenIndex], rootPath);
				continue;
			}
			const fileChildren = {
				name: item,
				path: rootPath,
				isFolder: false,
				expand: false,
			};
			fileTree.children.push(fileChildren);

		}
		return fileTree;
	}

}
