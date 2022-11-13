import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import config from './config/app.config';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ConfigModule.forRoot({
			load: [config],
		}),
		AuthModule,
	],
})
export class AppModule {
}
