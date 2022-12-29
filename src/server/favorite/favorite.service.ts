import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { Transaction } from 'sequelize';
import { FileService as RsFileService, FsItem } from '../../../index';
import { UserDto } from '../user/dto/user.dto';
import { FavoriteDatabaseService } from './favorite-database.service';

@Injectable()
export class FavoriteService {

	private readonly basePath;

	constructor(
		private readonly configService: ConfigService,
		private readonly favoriteDatabaseService: FavoriteDatabaseService,
	) {
		this.basePath = this.configService.get('app.path');
	}

	async setFavorite({ uuid, id }: UserDto,
	                  favorites: Array<string>,
	                  state: boolean,
	                  transaction: Transaction,
	): Promise<void> {
		for (const favorite of favorites) {
			const fullPath = path.join(this.basePath, uuid, favorite);

			if (state)
				await this.favoriteDatabaseService.addFavorite(id, fullPath, transaction);
			else
				await this.favoriteDatabaseService.deleteFavorite(id, fullPath, transaction);

			await RsFileService.setFavorite(fullPath, state);

		}
	}

	async getFavorites({ id }: UserDto): Promise<Array<FsItem>> {
		const paths = await this.favoriteDatabaseService.getFavoritesPaths(id);
		return await RsFileService.getFilesMetadata(paths, false);
	}
}
