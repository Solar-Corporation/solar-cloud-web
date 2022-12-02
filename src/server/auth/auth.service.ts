import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Transaction } from 'sequelize';
import { IAuth } from '../../shared/interfaces/auth.interface';
import { JwtToken } from '../../shared/types/auth.type';
import { ErrorsConfig } from '../config/error.config';
import { UserDto } from '../user/dto/user.dto';
import { UserDatabaseService } from '../user/user-database.service';
import { AuthDatabaseService } from './auth-database.service';
import { DeviceDataDto, EmailLoginDto, UserRegistrationDto } from './dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService implements IAuth<EmailLoginDto | DeviceDataDto> {

	constructor(
		private readonly userDataBaseService: UserDatabaseService,
		private readonly tokenService: TokenService,
		private readonly configService: ConfigService,
		private readonly authDatabaseService: AuthDatabaseService,
	) {
	}

	/**
	 * Метод для регистрации пользователя в системе.
	 * @param {UserRegistrationDto} registrationUserDto - данные пользователя, которые необходимы для регистрации.
	 * @param {DeviceDataDto} deviceDataDto - данные устройства пользователя.
	 * @param {Transaction} transaction - транзакция БД.
	 * @returns {Promise<JwtToken>} - токены авторизации при успешной регистрации.
	 */
	async registration(
		registrationUserDto: UserRegistrationDto,
		deviceDataDto: DeviceDataDto,
		transaction: Transaction,
	): Promise<JwtToken> {
		const isUserExist = await this.userDataBaseService.checkEmail(registrationUserDto.email);
		if (isUserExist)
			throw new ConflictException(ErrorsConfig.userExist.message, ErrorsConfig.userExist.message);

		const salt = await bcrypt.genSalt();
		registrationUserDto.password = await bcrypt.hash(registrationUserDto.password, salt);

		const userDto = await this.userDataBaseService.createUser(registrationUserDto, transaction);

		return await this.createTokens(userDto, deviceDataDto, transaction);
	}

	/**
	 * Метод авторизации пользователя в системе.
	 * @param {EmailLoginDto} emailLoginDto - данные пользователя, которые необходимы для авторизации.
	 * @param {DeviceDataDto} deviceDataDto - данные устройства пользователя.
	 * @param {Transaction} transaction - транзакция БД.
	 * @returns {Promise<JwtToken>} - токены при успешной авторизации.
	 */
	async login(
		emailLoginDto: EmailLoginDto,
		deviceDataDto: DeviceDataDto,
		transaction: Transaction,
	): Promise<JwtToken> {
		const isUserExist = await this.userDataBaseService.checkEmail(emailLoginDto.email);
		if (!isUserExist)
			throw new NotFoundException(ErrorsConfig.emailNotFound.message, ErrorsConfig.emailNotFound.message);

		const userAuthDto = await this.userDataBaseService.getUserByEmail(emailLoginDto.email);

		const isPasswordCompare = await bcrypt.compare(emailLoginDto.password, userAuthDto.password);
		if (!isPasswordCompare)
			throw new UnauthorizedException(ErrorsConfig.wrongPassword.message, ErrorsConfig.wrongPassword.message);

		const userDto: any = userAuthDto;
		delete userDto.password;
		return await this.createTokens(userDto, deviceDataDto, transaction);
	}

	/**
	 * Метод удаления авторизации пользователя.
	 * @param refreshToken - refresh токен из cookie.
	 * @param {Transaction} transaction - транзакция БД.
	 * @return {Promise<void>}
	 */
	async logout(refreshToken: string, transaction: Transaction): Promise<void> {
		const isExist = await this.authDatabaseService.checkToken(refreshToken);
		if (!isExist)
			throw new NotFoundException(ErrorsConfig.sessionNotFound.message, ErrorsConfig.sessionNotFound.message);

		await this.authDatabaseService.deleteAuth(refreshToken, transaction);
	}

	/**
	 * Метод обновления токена доступа.
	 * @param {string} refreshToken - refresh токен из cookie.
	 * @returns {Promise<JwtToken>} - токены авторизации.
	 */
	async refresh(
		refreshToken: string,
	): Promise<JwtToken> {
		if (!refreshToken)
			throw new UnauthorizedException(ErrorsConfig.unauthorized.message, ErrorsConfig.unauthorized.message);

		const userDto = this.tokenService.validateJwtToken(refreshToken);
		const isExist = await this.authDatabaseService.checkToken(refreshToken);
		if (!userDto || !isExist)
			throw new UnauthorizedException(ErrorsConfig.unauthorized.message, ErrorsConfig.unauthorized.message);

		const accessExpiresIn = this.configService.get<number>('auth.accessExpiresIn')!;
		const accessSecretKey = this.configService.get<string>('auth.accessSecretKey')!;

		return {
			refresh: refreshToken,
			access: this.tokenService.createJwtToken(userDto, accessSecretKey, accessExpiresIn),
		};
	}

	/**
	 * Метод для генерации пары токенов авторизации (access и refresh).
	 * @param {UserDto} userDto - данные пользователя. Будут помещены в payload ткена.
	 * @param {DeviceDataDto} deviceDataDto - данные устройства пользователя.
	 * @param {Transaction} transaction - транзакция БД.
	 * @returns {Promise<JwtToken>} - токены авторизации.
	 * @private
	 */
	private async createTokens(
		userDto: UserDto,
		deviceDataDto: DeviceDataDto,
		transaction: Transaction,
	): Promise<JwtToken> {
		const refreshExpiresIn = this.configService.get<number>('auth.refreshExpiresIn')!;
		const accessExpiresIn = this.configService.get<number>('auth.accessExpiresIn')!;

		const accessSecretKey = this.configService.get<string>('auth.accessSecretKey')!;
		const refreshSecretKey = this.configService.get<string>('auth.refreshSecretKey')!;

		const jwtTokens = {
			refresh: this.tokenService.createJwtToken(userDto, refreshSecretKey, refreshExpiresIn),
			access: this.tokenService.createJwtToken(userDto, accessSecretKey, accessExpiresIn),
		};

		const expiredDay = Math.floor(refreshExpiresIn / (3600 * 24));
		const dateExpired = new Date();
		dateExpired.setDate(dateExpired.getDate() + expiredDay);
		await this.authDatabaseService.createAuth({
			dateExpired: dateExpired,
			deviceIp: deviceDataDto.deviceIp,
			deviceUa: deviceDataDto.deviceUa,
			refreshToken: jwtTokens.refresh,
			userId: userDto.id,
		}, transaction);

		return jwtTokens;
	}
}
