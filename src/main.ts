import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { RenderService } from 'nest-next';
import { AppModule } from './server/app.module';

declare const module: any;

const bootstrap = async () => {
	const app = await NestFactory.create(AppModule.initialize());
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

	const service = app.get(RenderService);
	service.setErrorHandler(async (err, req, res) => {
		console.error(err);
		res.send(err.response);
	});

	await app.use(cookieParser());
	await app.listen(port);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}

};

(async () => {
	await bootstrap();
})();
