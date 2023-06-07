import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RsErrorInterceptor } from '../common/interceptors/rs-error.interceptor';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { S3Module } from '../s3/s3.module';
import { UserModule } from '../user/user.module';
import { TrashController } from './trash.controller';
import { TrashService } from './trash.service';

@Module({
	imports: [
		PassportModule.register({
			defaultStrategy: 'jwt',
			property: 'user',
			session: false,
		}),
		JwtModule.register({
			secret: process.env.JWT_ACCESS_KEY_SECRET,
			signOptions: {
				expiresIn: process.env.EXPIRESIN_ACCESS_SECRET,
			},
		}),
		ConfigModule,
		UserModule,
		AuthModule,
		S3Module,
	],
	controllers: [TrashController],
	providers: [TrashService, JwtAuthGuard, TransactionInterceptor, RsErrorInterceptor],
	exports: [TrashService],
})
export class TrashModule {

}
