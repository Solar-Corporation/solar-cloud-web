import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
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
import { FileTree } from '../../../index';

import { TransactionParam } from '../common/decorators/transaction.decorator';
import { RsErrorInterceptor } from '../common/interceptors/rs-error.interceptor';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { UserDto } from '../user/dto/user.dto';
import { FileUploadDto, ParamDirDto, ParamFileDto, RenameQueryDto } from './dto/file.dto';
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
		@Req() req: Request,
	): Promise<void> {
		const { user } = req;
		await this.fileService.saveFile(fileUploadDto, user as UserDto);
	}

	@Get('files/:file_path')
	@UseGuards(AuthGuard())
	@UseInterceptors(RsErrorInterceptor)
	async getFile(
		@Param() { path }: ParamFileDto,
		@Req() req: Request,
		@Res() res: Response,
	): Promise<void> {
		const { user } = req;
		const { name, fileMime, stream } = await this.fileService.getFile(path, user as UserDto);
		res.set({
			'Content-Type': fileMime,
			'Content-Disposition': `attachment; filename="${name}"`,
		});
		stream!.pipe(res);
	}

	@Put('files/:path')
	@UseGuards(AuthGuard())
	@UseInterceptors(TransactionInterceptor)
	@UseInterceptors(RsErrorInterceptor)
	async renameFile(
		@Param() { path }: ParamFileDto,
		@Query() { newName }: RenameQueryDto,
		@Req() req: Request,
		@TransactionParam() transaction: Transaction,
	): Promise<void> {
		const { user } = req;
		await this.fileService.renameFile({ path: path, newName: newName }, user as UserDto, transaction);
	}

	@Delete('files/:filePath')
	@UseGuards(AuthGuard())
	@UseInterceptors(TransactionInterceptor)
	@UseInterceptors(RsErrorInterceptor)
	async deleteFile(
		@Param() param: ParamFileDto,
		@Req() req: Request,
		@TransactionParam() transaction: Transaction,
	): Promise<void> {

	}

	@Post()
	async createDirectory() {

	}

	@Put()
	async renameDirectory() {

	}

	@Delete()
	async deleteDirectory() {

	}

	@Get('files')
	@UseGuards(AuthGuard())
	@UseInterceptors(RsErrorInterceptor)
	async getFileTree(
		@Query() { dirPath }: ParamDirDto,
		@Req() req: Request,
	): Promise<Array<FileTree>> {
		const { user } = req;
		return this.fileService.getFileTree(user as UserDto, dirPath);
	}
}
