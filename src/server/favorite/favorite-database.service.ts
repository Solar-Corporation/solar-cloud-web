import { Injectable } from '@nestjs/common';
import { QueryTypes, Transaction } from 'sequelize';
import { SequelizeConnect } from '../database/database-connect';

@Injectable()
export class FavoriteDatabaseService {
	async addFavorite(userId: number, path: string, transaction: Transaction): Promise<void> {
		await SequelizeConnect.query(`CALL file_data.add_favorite(${userId}, '${path}')`, {
			transaction: transaction,
		});
	}

	async deleteFavorite(userId: number, path: string, transaction: Transaction): Promise<void> {
		await SequelizeConnect.query(`CALL file_data.delete_favorite(${userId}, '${path}')`, {
			transaction: transaction,
		});
	}

	async getFavoritesPaths(userId: number): Promise<Array<string>> {
		const [paths]: any = await SequelizeConnect.query(`SELECT file_data.get_favorites(${userId})`, {
			type: QueryTypes.SELECT,
			nest: true,
		});
		return paths.get_favorites;
	}
}
