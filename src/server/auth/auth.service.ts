import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Transaction } from 'sequelize';
import { IAuth } from '../../shared/interfaces/auth.interface';
import { EmailLoginOptions, JwtToken } from '../../shared/types/auth.type';
import { ErrorsConfig } from '../config/error.config';
import { UserDatabaseService } from '../user/user-database.service';
import { AuthDatabaseService } from './auth-database.service';
import { DeviceDataDto, RegistrationUserDto } from './dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService implements IAuth<EmailLoginOptions> {

	constructor(
		private readonly userDataBaseService: UserDatabaseService,
		private readonly tokenService: TokenService,
		private readonly configService: ConfigService,
		private readonly authDatabaseService: AuthDatabaseService,
	) {
	}

	async registration(registrationUserDto: RegistrationUserDto, deviceDataDto: DeviceDataDto, transaction: Transaction): Promise<JwtToken> {
		const isUserExist = await this.userDataBaseService.checkEmail(registrationUserDto.email);
		if (isUserExist)
			throw new ConflictException(ErrorsConfig.userExist.message, ErrorsConfig.userExist.message);

		const salt = await bcrypt.genSalt();
		registrationUserDto.password = await bcrypt.hash(registrationUserDto.password, salt);

		const userDto = await this.userDataBaseService.createUser(registrationUserDto, transaction);
		const refreshExpiresIn = Number(this.configService.get<number>('auth.refreshExpiresIn'));
		const accessExpiresIn = Number(this.configService.get<number>('auth.accessExpiresIn'));
		const jwtTokens = {
			refresh: this.tokenService.create(userDto, refreshExpiresIn),
			access: this.tokenService.create(userDto, accessExpiresIn),
		};

		const expiredDay = Math.floor(refreshExpiresIn / (3600 * 24));
		const dateExpired = new Date();
		dateExpired.setDate(dateExpired.getDate() + expiredDay);
		await this.authDatabaseService.create({
			dateExpired: dateExpired,
			deviceIp: deviceDataDto.deviceIp,
			deviceUa: deviceDataDto.deviceUa,
			refreshToken: jwtTokens.refresh,
			userId: userDto.id,
		}, transaction);

		return jwtTokens;
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
