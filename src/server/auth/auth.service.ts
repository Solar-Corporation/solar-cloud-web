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

	async login(
		emailLoginDto: EmailLoginDto,
		deviceDataDto: DeviceDataDto,
		transaction: Transaction,
	): Promise<JwtToken> {
		const isUserExist = await this.userDataBaseService.checkEmail(emailLoginDto.email);
		if (!isUserExist)
			throw new NotFoundException(ErrorsConfig.notFound.message, ErrorsConfig.notFound.message);

		const userAuthDto = await this.userDataBaseService.getUserByEmail(emailLoginDto.email);

		const isPasswordCompare = await bcrypt.compare(emailLoginDto.password, userAuthDto.password);
		if (!isPasswordCompare)
			throw new UnauthorizedException(ErrorsConfig.wrongPassword.message, ErrorsConfig.wrongPassword.message);

		const userDto: any = userAuthDto;
		delete userDto.password;
		return await this.createTokens(userDto, deviceDataDto, transaction);
	}

	/**
	 *
	 * @param refreshToken
	 * @param {} transaction
	 * @return {Promise<void>}
	 */
	async logout(refreshToken: string, transaction: Transaction): Promise<void> {
		await this.authDatabaseService.deleteAuth(refreshToken, transaction);
	}

	/**
	 *
	 * @param {string} refreshToken
	 * @return {Promise<JwtToken>}
	 */
	async refresh(
		refreshToken: string,
	): Promise<JwtToken> {
		const userDto = this.tokenService.validateJwtToken(refreshToken);
		const isExist = await this.authDatabaseService.checkToken(refreshToken);
		if (!userDto || !isExist)
			throw new UnauthorizedException(ErrorsConfig.unauthorized.message, ErrorsConfig.unauthorized.message);

		const accessExpiresIn = Number(this.configService.get<number>('auth.accessExpiresIn'));

		return {
			refresh: refreshToken,
			access: this.tokenService.createJwtToken(userDto, accessExpiresIn),
		};
	}

	private async createTokens(
		userDto: UserDto,
		deviceDataDto: DeviceDataDto,
		transaction: Transaction,
	): Promise<JwtToken> {
		const refreshExpiresIn = Number(this.configService.get<number>('auth.refreshExpiresIn'));
		const accessExpiresIn = Number(this.configService.get<number>('auth.accessExpiresIn'));
		const jwtTokens = {
			refresh: this.tokenService.createJwtToken(userDto, refreshExpiresIn),
			access: this.tokenService.createJwtToken(userDto, accessExpiresIn),
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
