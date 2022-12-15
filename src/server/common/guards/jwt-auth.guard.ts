import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayloadDto } from '../../auth/dto';
import { UserDto } from '../../user/dto/user.dto';
import { UserDatabaseService } from '../../user/user-database.service';

@Injectable()
export class JwtAuthGuard extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService, private readonly userDatabaseService: UserDatabaseService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get('auth.accessSecretKey'),
		});
	}

	async validate(payload: TokenPayloadDto): Promise<UserDto> {
		const user = await this.userDatabaseService.getUserById(payload.id);

		if (!user.id)
			throw new UnauthorizedException('Invalid token', 'Invalid user access token!');

		return user;
	}
}
