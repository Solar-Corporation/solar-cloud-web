import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	Query,
	Req,
	Res,
	StreamableFile,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { FormDataRequest } from 'nestjs-form-data';
import { Space } from '../s3/bucket.service';

import { HashPath, Properties } from '../s3/item.service';
import { UserDto } from '../user/dto/user.dto';
import { DirCreateDto, FileUploadDto, HashesDto, MovePaths, PathDto, RenameQueryDto } from './dto/file.dto';
import { FileService } from './file.service';

@Controller({ version: '1' })
export class FileController {
	constructor(
		private readonly fileService: FileService,
	) {
	}

	@Post('files')
	@UseGuards(AuthGuard())
	@FormDataRequest()
	async saveFile(
		@Body() fileUploadDto: FileUploadDto,
		@Req() { user }: Request,
	): Promise<void> {
		await this.fileService.saveFile(fileUploadDto, user as UserDto);
	}


	@Get('files/:hash')
	@UseGuards(AuthGuard())
	async getFile(
		@Param() { hash }: PathDto,
		@Req() { user }: Request,
		@Res({ passthrough: true }) res: Response,
	): Promise<StreamableFile> {
		const { fileMime, stream, name } = await this.fileService.getFile(user as UserDto, hash);
		// @ts-ignore
		res.set({
			'Content-Type': `${fileMime}; charset=utf-8`,
			'Content-Disposition': `attachment; filename="${encodeURI(name!)}"`,
		});
		return new StreamableFile(stream);
	}

	@Get('files/:hash/path')
	@UseGuards(AuthGuard())
	async getFilePath(
		@Param() { hash }: PathDto,
		@Req() { user }: Request,
	): Promise<Array<HashPath>> {
		return await this.fileService.getPath(user as UserDto, hash);
	}

	@Put('files/:hash')
	@UseGuards(AuthGuard())
	async renameFile(
		@Param() { hash }: PathDto,
		@Query() { newName }: RenameQueryDto,
		@Req() { user }: Request,
	): Promise<void> {
		await this.fileService.rename(user as UserDto, hash, newName);
	}


	@Delete('files')
	@UseGuards(AuthGuard())
	async delete(
		@Req() { user }: Request,
		@Body() { hashes }: HashesDto,
	): Promise<void> {
		await this.fileService.delete(user as UserDto, hashes);
	}

	@Post('directories')
	@UseGuards(AuthGuard())
	async createDirectory(
		@Body() { hash, name }: DirCreateDto,
		@Req() { user }: Request,
	): Promise<{ hash: string }> {
		return { hash: await this.fileService.createDir(user as UserDto, hash, name) };
	}

	@Get('files')
	@UseGuards(AuthGuard())
	async getFileTree(
		@Query() { hash }: PathDto,
		@Req() { user }: Request,
	): Promise<Array<Properties>> {
		hash = (hash) ? hash : '';
		return this.fileService.getFileTree(user as UserDto, hash);
	}


	@Patch('files')
	@UseGuards(AuthGuard())
	async moveFiles(
		@Body() { hashes }: MovePaths,
		@Req() { user }: Request,
	): Promise<void> {
		await this.fileService.moveFiles(user as UserDto, hashes);
	}

	@Patch('files/copy')
	@UseGuards(AuthGuard())
	async copyFiles(
		@Body() { hashes }: MovePaths,
		@Req() { user }: Request,
	): Promise<void> {
		await this.fileService.copyFiles(user as UserDto, hashes);
	}

	@Get('space')
	@UseGuards(AuthGuard())
	async getSpace(
		@Req() { user }: Request,
	): Promise<Space> {
		return await this.fileService.getSpace(user as UserDto);
	}
}
