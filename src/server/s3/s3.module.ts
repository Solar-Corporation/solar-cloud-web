import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RsErrorInterceptor } from '../common/interceptors/rs-error.interceptor';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { BucketDatabaseService } from './bucket-database.service';
import { BucketService } from './bucket.service';
import { ItemService } from './item.service';
import { StorageService } from './storage.service';
import { UtilService } from './util.service';

@Module({
	imports: [
		ConfigModule,
	],
	controllers: [],
	providers: [
		BucketService, BucketDatabaseService,
		StorageService, ItemService, UtilService,
		TransactionInterceptor, RsErrorInterceptor,
	],
	exports: [
		BucketService,
		StorageService,
		UtilService,
		ItemService],
})
export class S3Module {
}
