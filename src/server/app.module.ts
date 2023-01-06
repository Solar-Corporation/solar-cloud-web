import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import config from './config/app.config';
import { FavoriteModule } from './favorite/favorite.module';
import { FileModule } from './file/file.module';
import { TrashModule } from './trash/trash.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ConfigModule.forRoot({
			load: [config],
		}),
		AuthModule,
		FileModule,
		FavoriteModule,
		TrashModule,
	],
})
export class AppModule {
}
