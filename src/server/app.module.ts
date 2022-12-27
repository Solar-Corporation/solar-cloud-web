import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import config from './config/app.config';
import { FavoriteModule } from './favorite/favorite.module';
import { FileModule } from './file/file.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ConfigModule.forRoot({
			load: [config],
		}),
		AuthModule,
		FileModule,
		FavoriteModule,
	],
})
export class AppModule {

}
