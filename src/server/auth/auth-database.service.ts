import { Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { SequelizeConnect } from '../database/database-connect';
import { RefreshTokenDto } from './dto';

@Injectable()
export class AuthDatabaseService {

	/**
	 * Метод для сохранения в БД данных об авторизации пользователя.
	 * @param {RefreshTokenDto} refreshTokenDto - данные о токене.
	 * @param {Transaction} transaction - транзакция БД.
	 * @returns {Promise<number>} - ID токена из БД.
	 */
	async createAuth(refreshTokenDto: RefreshTokenDto, transaction: Transaction): Promise<number> {
		const jwtDto: any = await SequelizeConnect.query(`SELECT security_data.add_jwt('${JSON.stringify(refreshTokenDto)}')`,
			{ transaction: transaction });
		return jwtDto[0][0].add_jwt;
	}

	/**
	 * Метод удаления информации об авторизации пользователя.
	 * @param {string} refreshToken - токен авторизации.
	 * @param {Transaction} transaction - транзакция БД.
	 * @returns {Promise<void>}
	 */
	async deleteAuth(refreshToken: string, transaction: Transaction): Promise<void> {
		await SequelizeConnect.query(`CALL security_data.delete_jwt('${refreshToken}')`,
			{ transaction: transaction });
	}

	/**
	 * Метод проверки наличия токена в БД.
	 * @param {string} refreshToken - токен авторизации.
	 * @returns {Promise<boolean>} - если нет, то возвращает false, если есть то true.
	 */
	async checkToken(refreshToken: string): Promise<boolean> {
		const isExist: any = await SequelizeConnect.query(`SELECT security_data.check_refresh_token('${refreshToken}')`);
		return isExist[0][0].check_refresh_token;
	}
}
