import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserDatabaseService } from './user-database.service';
import { UserService } from './user.service';


@Module({
	imports: [
		ConfigModule,
	],
	controllers: [],
	providers: [UserDatabaseService, UserService],
	exports: [UserDatabaseService, UserService],
})
export class UserModule {
}
