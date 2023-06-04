import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RsErrorInterceptor } from '../common/interceptors/rs-error.interceptor';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { S3Module } from '../s3/s3.module';
import { UserModule } from '../user/user.module';
import { DownloadController } from './download.controller';
import { DownloadService } from './download.service';

@Module({
	imports: [
		ConfigModule,
		UserModule,
		AuthModule,
		S3Module,
		NestjsFormDataModule,
		ScheduleModule.forRoot(),
	],
	controllers: [DownloadController],
	providers: [DownloadService, JwtAuthGuard, TransactionInterceptor, RsErrorInterceptor],
	exports: [DownloadService],
})
export class DownloadModule {
}
