import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class TokenService {
	constructor(
		private readonly jwtService: JwtService,
	) {
	}

	/**
	 * Метод создаёт JWT токен.
	 * @param {UserDto} userDto - payload токена с пользовательскими данными.
	 * @param {string} secretKey - секретный ключ для подписи токена.
	 * @param {number} expireIn - время, через которое токен станет недействительным.
	 * @returns {string} - JWT токен.
	 */
	createJwtToken(userDto: UserDto, secretKey: string, expireIn: number): string {
		return this.jwtService.sign({
			unique: uuidv4(),
			...userDto,
		}, {
			secret: secretKey,
			expiresIn: expireIn,
		});
	}

	/**
	 * Метод валидирует JWT токен на корректность.
	 * @param {string} token - JWT токен.
	 * @param secret
	 * @returns {UserDto} - информацию из токена, если данные корректны.
	 */
	validateJwtToken(token: string, secret: string): UserDto {
		const userData: any = this.jwtService.verify(token, { secret: secret });
		delete userData.iat;
		delete userData.exp;
		delete userData.unique;
		return userData;
	}
}
