import { Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { SequelizeConnect } from '../database/database-connect';
import { RefreshTokenDto } from './dto';

@Injectable()
export class AuthDatabaseService {
	async create(refreshTokenDto: RefreshTokenDto, transaction: Transaction): Promise<number> {
		const jwtDto: any = await SequelizeConnect.query(`SELECT security_data.add_jwt('${JSON.stringify(refreshTokenDto)}')`,
			{ transaction: transaction });
		return jwtDto[0][0].add_jwt;
	}
}
