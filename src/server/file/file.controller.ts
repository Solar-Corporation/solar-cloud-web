import {
	Body,
	Controller,
	Delete,
	Get,
	Headers,
	Param,
	Patch,
	PayloadTooLargeException,
	Post,
	Put,
	Query,
	Req,
	Res,
	StreamableFile,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { FormDataRequest } from 'nestjs-form-data';
import { Space } from '../s3/bucket.service';

import { Properties } from '../s3/item.service';
import { UserDto } from '../user/dto/user.dto';
import { DirCreateDto, FileUploadDto, HashDto, HashesDto, MoveHashes, RenameQueryDto, SearchDto } from './dto/file.dto';
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

	@Get('files/:hash/stream')
	@UseGuards(AuthGuard())
	async getStreamFile(
		@Headers() headers: any,
		@Param() { hash }: HashDto,
		@Req() { user }: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const file = await this.fileService.getFile(user as UserDto, hash);
		if (file.size > 314572800)
			throw new PayloadTooLargeException('Файл слишком большого размера, его нельзя просмотреть!');
		res.set({
			'Content-Type': `${file.fileMime}; charset=utf-8`,
			'Content-Disposition': `attachment; filename="${encodeURIComponent(file.name!)}"`,
		});
		return new StreamableFile(file.stream);

	}

	@Get('files/:hash/download')
	@UseGuards(AuthGuard())
	async getDownloadFile(
		@Headers() headers: any,
		@Param() { hash }: HashDto,
		@Req() { user }: Request,
	) {
		const file = await this.fileService.getFile(user as UserDto, hash);
		const { name, token } = await this.fileService.downloadSaveLargeFiles(file);
		const url = `http://${headers.host}/download?token=${token}&name=${name}`;
		return { url };
	}


	@Get('files/:hash/path')
	@UseGuards(AuthGuard())
	async getFilePath(
		@Param() { hash }: HashDto,
		@Req() { user }: Request,
	): Promise<Array<Properties>> {
		return await this.fileService.getPath(user as UserDto, hash);
	}

	@Put('files/:hash')
	@UseGuards(AuthGuard())
	async renameFile(
		@Param() { hash }: HashDto,
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
		@Query() { hash }: HashDto,
		@Req() { user }: Request,
	): Promise<Array<Properties>> {
		hash = (hash) ? hash : '';
		return this.fileService.getFileTree(user as UserDto, hash);
	}

	@Patch('files')
	@UseGuards(AuthGuard())
	async moveFiles(
		@Body() { hashes }: MoveHashes,
		@Req() { user }: Request,
	): Promise<void> {
		await this.fileService.moveFiles(user as UserDto, hashes);
	}

	@Patch('files/copy')
	@UseGuards(AuthGuard())
	async copyFiles(
		@Body() { hashes }: MoveHashes,
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

	@Get('search?')
	@UseGuards(AuthGuard())
	async searchFiles(
		@Req() { user }: Request,
		@Query() { name }: SearchDto,
	): Promise<Array<Properties>> {
		return await this.fileService.search(user as UserDto, name);
	}
}
