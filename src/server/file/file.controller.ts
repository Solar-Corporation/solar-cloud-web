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
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { FormDataRequest } from 'nestjs-form-data';
import { Transaction } from 'sequelize';

import { FsItem } from '../../../index';
import { TransactionParam } from '../common/decorators/transaction.decorator';
import { RsErrorInterceptor } from '../common/interceptors/rs-error.interceptor';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { UserDto } from '../user/dto/user.dto';
import { DirCreateDto, FileUploadDto, MovePaths, PathDto, PathsDto, RenameQueryDto } from './dto/file.dto';
import { FileService } from './file.service';

@Controller({ version: '1' })
export class FileController {
	constructor(
		private readonly fileService: FileService,
	) {
	}

	@Post('files')
	@UseGuards(AuthGuard())
	@UseInterceptors(RsErrorInterceptor)
	@FormDataRequest()
	async saveFile(
		@Body() fileUploadDto: FileUploadDto,
		@Req() { user }: Request,
	): Promise<void> {
		await this.fileService.saveFile(fileUploadDto, user as UserDto);
	}

	@Get('files/:path')
	@UseGuards(AuthGuard())
	@UseInterceptors(RsErrorInterceptor)
	async getFile(
		@Param() { path }: PathDto,
		@Req() { user }: Request,
		@Res() res: Response,
	): Promise<void> {
		const { fileMime, stream, name } = await this.fileService.getFile(path, user as UserDto);
		res.set({
			'Content-Type': `${fileMime}; charset=utf-8`,
			'Content-Disposition': `attachment; filename="${encodeURI(name!)}"`,
		});
		stream!.pipe(res);
	}

	@Put('files/:path')
	@UseGuards(AuthGuard())
	@UseInterceptors(TransactionInterceptor)
	@UseInterceptors(RsErrorInterceptor)
	async renameFile(
		@Param() { path }: PathDto,
		@Query() { newName }: RenameQueryDto,
		@Req() { user }: Request,
		@TransactionParam() transaction: Transaction,
	): Promise<void> {
		await this.fileService.rename({ path: path, newName: newName }, user as UserDto, transaction);
	}

	@Delete('files')
	@UseGuards(AuthGuard())
	@UseInterceptors(TransactionInterceptor)
	@UseInterceptors(RsErrorInterceptor)
	async delete(
		@Req() { user }: Request,
		@Body() { paths }: PathsDto,
		@TransactionParam() transaction: Transaction,
	): Promise<void> {
		await this.fileService.delete(user as UserDto, paths, transaction);
	}

	@Post('directories')
	@UseGuards(AuthGuard())
	@UseInterceptors(RsErrorInterceptor)
	async createDirectory(
		@Body() dirCreateDto: DirCreateDto,
		@Req() { user }: Request,
	) {
		await this.fileService.createDir(user as UserDto, dirCreateDto);
	}

	@Get('files')
	@UseGuards(AuthGuard())
	@UseInterceptors(RsErrorInterceptor)
	async getFileTree(
		@Query() { path }: PathDto,
		@Req() { user }: Request,
	): Promise<Array<FsItem>> {
		return this.fileService.getFileTree(user as UserDto, path);
	}

	@Patch('files')
	@UseGuards(AuthGuard())
	@UseInterceptors(TransactionInterceptor)
	@UseInterceptors(RsErrorInterceptor)
	async moveFiles(
		@Body() { paths }: MovePaths,
		@Req() { user }: Request,
		@TransactionParam() transaction: Transaction,
	): Promise<void> {
		await this.fileService.moveFiles(user as UserDto, paths, transaction);
	}
}
