import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import config from './config/app.config';

@Module({
	imports: [
		AuthModule,
		ConfigModule.forRoot({
			load: [config],
		})],
})
export class AppModule {
}
