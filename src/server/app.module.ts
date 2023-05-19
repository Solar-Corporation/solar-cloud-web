import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RenderModule } from 'nest-next';
import Next from 'next';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ParamsInterceptor } from './common/interceptors/params.interceptor';
import config from './config/app.config';
import { FavoriteModule } from './favorite/favorite.module';
import { FileModule } from './file/file.module';
import { S3Module } from './s3/s3.module';
import { ShareModule } from './share/share.module';
import { TrashModule } from './trash/trash.module';

declare const module: any;

@Module({})
export class AppModule {
	public static initialize(): DynamicModule {
		const renderModule =
			module.hot?.data?.renderModule ??
			RenderModule.forRootAsync(Next({ dev: true }), {
				viewsDir: null,
			});

		if (module.hot) {
			module.hot.dispose((data: any) => {
				data.renderModule = renderModule;
			});
		}

		return {
			module: AppModule,
			imports: [
				ConfigModule.forRoot(),
				ConfigModule.forRoot({
					load: [config],
				}),
				AuthModule,
				FileModule,
				FavoriteModule,
				TrashModule,
				renderModule,
				S3Module,
				ShareModule,
			],
			controllers: [AppController],
			providers: [ParamsInterceptor],
		};
	}
}
