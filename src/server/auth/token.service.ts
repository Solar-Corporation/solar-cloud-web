import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class TokenService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {
	}

	/**
	 * Метод создаёт JWT токен.
	 * @param {UserDto} userDto - payload токена с пользовательскими данными.
	 * @param {number} expireIn - время, через которое токен станет недействительным.
	 * @returns {string} - JWT токен.
	 */
	createJwtToken(userDto: UserDto, expireIn: number): string {
		return this.jwtService.sign({ unique: uuidv4(), ...userDto }, { expiresIn: expireIn });
	}

	/**
	 * Метод валидирует JWT токен на корректность.
	 * @param {string} token - JWT токен.
	 * @returns {UserDto} - информацию из токена, если данные корректны.
	 */
	validateJwtToken(token: string): UserDto {
		const userData: any = this.jwtService.verify(token, { secret: this.configService.get('auth.secretKey') });
		delete userData.iat;
		delete userData.exp;
		delete userData.unique;
		return userData;
	}
}
