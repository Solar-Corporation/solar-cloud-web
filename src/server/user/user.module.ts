import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserDatabaseService } from './user-database.service';


@Module({
	imports: [
		ConfigModule,
	],
	controllers: [],
	providers: [UserDatabaseService],
	exports: [UserDatabaseService],
})
export class UserModule {
}
