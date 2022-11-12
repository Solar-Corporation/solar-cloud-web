import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './server/app.module';


const bootstrap = async () => {
	const app = await NestFactory.create(AppModule);
	await app.enableVersioning({
		type: VersioningType.URI,
	});

	const config = app.get<ConfigService>(ConfigService),
		port = config.get('app.port');

	await app.enableCors();
	await app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		}),
	);

	await app.use(cookieParser());
	await app.listen(port);
};

(async () => {
	await bootstrap();
})();
