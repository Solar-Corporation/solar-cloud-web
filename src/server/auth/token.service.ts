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
	 *
	 * @param {UserDto} userDto
	 * @param {number} expireIn
	 * @returns {string}
	 */
	createJwtToken(userDto: UserDto, expireIn: number): string {
		return this.jwtService.sign({ unique: uuidv4(), ...userDto }, { expiresIn: expireIn });
	}

	validateJwtToken(token: string): UserDto {
		const userData: any = this.jwtService.verify(token, { secret: this.configService.get('auth.secretKey') });
		delete userData.iat;
		delete userData.exp;
		delete userData.unique;
		return userData;
	}
}
