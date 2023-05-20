import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Transaction } from 'sequelize';
import { TransactionParam } from '../common/decorators/transaction.decorator';
import { HashesDto } from '../file/dto/file.dto';
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
	async addFavorite(
		@Body() { hashes }: HashesDto,
		@Req() { user }: Request,
	): Promise<void> {
		await this.favoriteService.setFavorite(user as UserDto, hashes, true);
	}

	@Delete('favorites')
	@UseGuards(AuthGuard())
	async deleteFavorite(
		@Body() { hashes }: HashesDto,
		@Req() { user }: Request,
		@TransactionParam() transaction: Transaction,
	): Promise<void> {
		await this.favoriteService.setFavorite(user as UserDto, hashes, false);
	}

	@Get('favorites')
	@UseGuards(AuthGuard())
	async getFavorites(
		@Req() { user }: Request,
	): Promise<any> {
		return await this.favoriteService.getFavorites(user as UserDto);
	}
}
