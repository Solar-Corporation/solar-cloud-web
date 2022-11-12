import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class JwtAuthGuard extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService, private readonly authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
			secretOrKey: configService.get('auth.secretKey'),
		});
	}
}
