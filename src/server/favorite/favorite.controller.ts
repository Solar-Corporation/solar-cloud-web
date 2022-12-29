import { Body, Controller, Delete, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Transaction } from 'sequelize';
import { FsItem } from '../../../index';
import { TransactionParam } from '../common/decorators/transaction.decorator';
import { RsErrorInterceptor } from '../common/interceptors/rs-error.interceptor';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { PathsDto } from '../file/dto/file.dto';
import { UserDto } from '../user/dto/user.dto';
import { FavoriteService } from './favorite.service';

@Controller({ version: '1' })
export class FavoriteController {

	constructor(
		private readonly favoriteService: FavoriteService,
	) {
	}

	@Post('favorites')
	@UseGuards(AuthGuard())
	@UseInterceptors(TransactionInterceptor)
	@UseInterceptors(RsErrorInterceptor)
	async addFavorite(
		@Body() { paths }: PathsDto,
		@Req() { user }: Request,
		@TransactionParam() transaction: Transaction,
	): Promise<void> {
		await this.favoriteService.setFavorite(user as UserDto, paths, true, transaction);
	}

	@Delete('favorites')
	@UseGuards(AuthGuard())
	@UseInterceptors(TransactionInterceptor)
	@UseInterceptors(RsErrorInterceptor)
	async deleteFavorite(
		@Body() { paths }: PathsDto,
		@Req() { user }: Request,
		@TransactionParam() transaction: Transaction,
	): Promise<void> {
		await this.favoriteService.setFavorite(user as UserDto, paths, false, transaction);
	}

	@Get('favorites')
	@UseGuards(AuthGuard())
	@UseInterceptors(RsErrorInterceptor)
	async getFavorites(
		@Req() { user }: Request,
	): Promise<Array<FsItem>> {
		return await this.favoriteService.getFavorites(user as UserDto);
	}
}
