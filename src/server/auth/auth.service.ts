import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Transaction } from 'sequelize';
import { IAuth } from '../../shared/interfaces/auth.interface';
import { EmailLoginOptions, JwtToken } from '../../shared/types/auth.type';
import { ErrorsConfig } from '../config/error.config';
import { UserDatabaseService } from '../user/user-database.service';
import { RegistrationUserDto } from './dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService implements IAuth<EmailLoginOptions> {

	constructor(
		private readonly userDataBaseService: UserDatabaseService,
		private readonly tokenService: TokenService,
		private readonly configService: ConfigService,
	) {
	}

	async registration(registrationUserDto: RegistrationUserDto, transaction: Transaction): Promise<JwtToken> {
		const isUserExist = await this.userDataBaseService.checkEmail(registrationUserDto.email);
		if (isUserExist)
			throw new ConflictException(ErrorsConfig.userExist.message, ErrorsConfig.userExist.message);

		const salt = await bcrypt.genSalt();
		registrationUserDto.password = await bcrypt.hash(registrationUserDto.password, salt);

		const userDto = await this.userDataBaseService.createUser(registrationUserDto, transaction);

		return {
			refresh: this.tokenService.create(userDto, Number(this.configService.get<number>('auth.refreshExpiresIn'))),
			access: this.tokenService.create(userDto, Number(this.configService.get<number>('auth.accessExpiresIn'))),
		};
	}

	/**
	 *
	 * @param {LoginOptions} loginOptions
	 * @param {} transaction
	 * @return {Promise<JwtToken>}
	 */
	async login(
		loginOptions: EmailLoginOptions,
		transaction: Transaction,
	): Promise<JwtToken> {

		return { refresh: '', access: '' };
	}

	/**
	 *
	 * @param {string} refresh
	 * @param {} transaction
	 * @return {Promise<void>}
	 */
	async logout(refresh: string, transaction: Transaction): Promise<void> {
	}

	/**
	 *
	 * @param {string} refresh
	 * @param {} transaction
	 * @return {Promise<JwtToken>}
	 */
	async refresh(
		refresh: string,
		transaction: Transaction,
	): Promise<JwtToken> {
		return { refresh: '', access: '' };
	}
}
