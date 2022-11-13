import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class TokenService {
	constructor(
		private readonly jwtService: JwtService,
	) {
	}

	create(userDto: UserDto, expireIn: number): string {
		return this.jwtService.sign(userDto, { expiresIn: expireIn });
	}
}
