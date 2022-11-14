import { Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { SequelizeConnect } from '../database/database-connect';
import { RefreshTokenDto } from './dto';

@Injectable()
export class AuthDatabaseService {
	/**
	 *
	 * @param {RefreshTokenDto} refreshTokenDto
	 * @param {Transaction} transaction
	 * @returns {Promise<number>}
	 */
	async createAuth(refreshTokenDto: RefreshTokenDto, transaction: Transaction): Promise<number> {
		const jwtDto: any = await SequelizeConnect.query(`SELECT security_data.add_jwt('${JSON.stringify(refreshTokenDto)}')`,
			{ transaction: transaction });
		return jwtDto[0][0].add_jwt;
	}

	/**
	 *
	 * @param {string} refreshToken
	 * @param {Transaction} transaction
	 * @returns {Promise<void>}
	 */
	async deleteAuth(refreshToken: string, transaction: Transaction): Promise<void> {
		await SequelizeConnect.query(`CALL security_data.delete_jwt('${refreshToken}')`, { transaction: transaction });
	}

	async checkToken(refreshToken: string): Promise<boolean> {
		const isExist: any = await SequelizeConnect.query(`SELECT security_data.check_refresh_token('${refreshToken}')`);
		return isExist[0][0].check_refresh_token;
	}
}
