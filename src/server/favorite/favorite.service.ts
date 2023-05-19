import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BucketService } from '../s3/bucket.service';
import { ItemService, Properties } from '../s3/item.service';
import { StorageService } from '../s3/storage.service';
import { UserDto } from '../user/dto/user.dto';


@Injectable()
export class FavoriteService {

	private readonly basePath;
	private readonly baseName;

	constructor(
		private readonly itemService: ItemService,
		private readonly bucketService: BucketService,
		private readonly configService: ConfigService,
		private readonly storageService: StorageService,
	) {
		this.basePath = this.configService.get('app.path');
		this.baseName = this.configService.get('app.name');
	}

	async setFavorite({ uuid }: UserDto,
	                  favorites: Array<string>,
	                  state: boolean,
	): Promise<void> {
		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);

		for (const favorite of favorites)
			if (state)
				await this.itemService.setFavorite(bucket, favorite);
			else
				await this.itemService.unsetFavorite(bucket, favorite);
	}

	async getFavorites({ uuid }: UserDto): Promise<Array<Properties>> {
		const store = await this.storageService.open(this.basePath, this.baseName);
		const bucket = await this.bucketService.open(store, uuid);
		return await this.itemService.getFavorites(bucket);
	}
}
