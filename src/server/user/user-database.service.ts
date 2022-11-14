import { Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { UserRegistrationDto } from '../auth/dto';
import { SequelizeConnect } from '../database/database-connect';
import { UserAuthDto, UserDto } from './dto/user.dto';

@Injectable()
export class UserDatabaseService {

	async checkEmail(email: string): Promise<Boolean> {
		const isExist: any = await SequelizeConnect.query(`SELECT user_data.check_user_by_email('${email}')`);
		return isExist[0][0].check_user_by_email;
	}

	async createUser(createUserDto: UserRegistrationDto, transaction: Transaction): Promise<UserDto> {
		const userId: any = await SequelizeConnect.query(`SELECT user_data.add_user('${JSON.stringify(createUserDto)}')`,
			{ transaction: transaction });
		return userId[0][0].add_user;
	}
}
