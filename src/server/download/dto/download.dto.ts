import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DownloadDto {
	@IsNotEmpty()
	@IsUUID()
	token!: string;

	@IsNotEmpty()
	@IsString()
	name!: string;
}
