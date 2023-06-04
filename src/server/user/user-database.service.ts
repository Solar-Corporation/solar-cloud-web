import { Injectable } from '@nestjs/common';
import { QueryTypes, Transaction } from 'sequelize';
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

	async getUserByEmail(email: string): Promise<UserAuthDto> {
		const userAuthDto: any = await SequelizeConnect.query(`SELECT user_data.get_user_by_email('${email}')`);
		return userAuthDto[0][0].get_user_by_email;
	}

	async getUserById(id: number): Promise<UserDto> {
		const userDto: any = await SequelizeConnect.query(`SELECT user_data.get_user_by_id(${id})`);
		return userDto[0][0].get_user_by_id;
	}

	async isEmailVerify(email: string): Promise<Boolean> {
		const [isEmail]: any = await SequelizeConnect.query(`SELECT user_data.is_email_verify($email)`, {
			type: QueryTypes.SELECT,
			bind: { email: email },
			nest: true,
		});
		return isEmail.is_email_verify;
	}

	async getUsersList(): Promise<Array<UserDto>> {
		const [users]: any = await SequelizeConnect.query(`SELECT user_data.get_users()`, {
			type: QueryTypes.SELECT,
		});
		return users.get_users;
	}

	async updateUserEmailStatus(userId: number, transaction: Transaction) {
		await SequelizeConnect.query(`CALL user_data.update_email_status($userId)`, {
			bind: {
				userId: userId,
			},
			transaction: transaction,
		});
	}

	async deleteUser(userId: number, transaction: Transaction): Promise<string> {
		const [userUuid]: any = await SequelizeConnect.query(`SELECT user_data.delete_user_by_id($userId)`, {
			bind: {
				userId: userId,
			},
			transaction: transaction,
		});
		return userUuid[0].delete_user_by_id;
	}
}
