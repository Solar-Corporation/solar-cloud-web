import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Module } from '../s3/s3.module';
import { UserDatabaseService } from './user-database.service';
import { UserService } from './user.service';


@Module({
	imports: [
		S3Module,
		ConfigModule,
	],
	controllers: [],
	providers: [UserDatabaseService, UserService],
	exports: [UserDatabaseService, UserService],
})
export class UserModule {
}
