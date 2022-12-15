import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	Req,
	Res,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { FormDataRequest } from 'nestjs-form-data';
import { Transaction } from 'sequelize';
import { Readable } from 'stream';
import { FileTree } from '../../shared/types/file.type';
import { TransactionParam } from '../common/decorators/transaction.decorator';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { UserDto } from '../user/dto/user.dto';
import { FileUploadDto, ParamFileDto, RenameFileDto } from './dto/file.dto';
import { FileService } from './file.service';

@Controller({ version: '1' })
export class FileController {
	constructor(private readonly fileService: FileService) {

	}

	@Post('files')
	@UseGuards(AuthGuard())
	@FormDataRequest()
	@UseInterceptors(TransactionInterceptor)
	async saveFile(
		@Body() fileUploadDto: FileUploadDto,
		@Req() req: Request,
		@TransactionParam() transaction: Transaction,
	): Promise<void> {
		const { user } = req;
		await this.fileService.saveFile(fileUploadDto, user as UserDto, transaction);
	}

	@Get('files/:file_path')
	@UseGuards(AuthGuard())
	async getFile(
		@Param() param: ParamFileDto,
		@Req() req: Request,
		@Res() res: Response,
	): Promise<void> {
		const { user } = req;
		const file = await this.fileService.getFile(param.filePath, user as UserDto);
		res.set({
			'Content-Type': file.fileMime,
			'Content-Disposition': `attachment; filename="${file.name}"`,
		});
		(file.stream as Readable).pipe(res);
	}

	@Patch('files')
	@UseGuards(AuthGuard())
	@UseInterceptors(TransactionInterceptor)
	async renameFile(
		@Body() renameFileDto: RenameFileDto,
		@Req() req: Request,
		@TransactionParam() transaction: Transaction,
	): Promise<void> {
		const { user } = req;
		await this.fileService.renameFile(renameFileDto, user as UserDto, transaction);
	}

	@Delete('files/:filePath')
	@UseGuards(AuthGuard())
	@UseInterceptors(TransactionInterceptor)
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
	async getFileTree(@Req() req: Request): Promise<FileTree> {
		const { user } = req;
		return this.fileService.getFileTree(user as UserDto);
	}
}
