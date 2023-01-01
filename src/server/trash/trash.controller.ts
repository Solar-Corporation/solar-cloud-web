import { Body, Controller, Delete, Get, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Transaction } from 'sequelize';

import { FsItem } from '../../../index';
import { TransactionParam } from '../common/decorators/transaction.decorator';
import { RsErrorInterceptor } from '../common/interceptors/rs-error.interceptor';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { PathsDto } from '../file/dto/file.dto';
import { UserDto } from '../user/dto/user.dto';
import { TrashService } from './trash.service';

@Controller({ version: '1' })
export class TrashController {

	constructor(
		private readonly trashService: TrashService,
	) {
	}

	@Get('trash')
	@UseGuards(AuthGuard())
	@UseInterceptors(RsErrorInterceptor)
	async getDeleteFiles(
		@Req() { user }: Request,
	): Promise<Array<FsItem>> {
		return await this.trashService.getDeleteFiles(user as UserDto);
	}

	@Put('trash')
	@UseGuards(AuthGuard())
	@UseInterceptors(TransactionInterceptor)
	@UseInterceptors(RsErrorInterceptor)
	async restoreFiles(
		@Body() { paths }: PathsDto,
		@Req() { user }: Request,
		@TransactionParam() transaction: Transaction,
	): Promise<void> {
		await this.trashService.restoreDeleteFiles(user as UserDto, paths, transaction);
	}

	@Delete('trash')
	@UseGuards(AuthGuard())
	@UseInterceptors(TransactionInterceptor)
	@UseInterceptors(RsErrorInterceptor)
	async clearFiles(
		@Req() { user }: Request,
		@TransactionParam() transaction: Transaction,
	): Promise<void> {
		await this.trashService.deletePaths(user as UserDto, transaction);
	}

}
