import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Module({
	imports: [
		PassportModule.register({
			defaultStrategy: 'jwt',
			property: 'user',
			session: false,
		}),
		JwtModule.register({
			secret: process.env.JWT_KEY_SECRET,
			signOptions: {
				expiresIn: process.env.EXPIRESIN_ACCESS_SECRET,
			},
		}),
		ConfigModule,
		UserModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtAuthGuard, TokenService],
	exports: [AuthService, JwtModule],
})
export class AuthModule {
}
