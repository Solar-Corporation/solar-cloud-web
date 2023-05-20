import { IsHash, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddShareDto {
	@IsHash('md5')
	hash!: string;
}

export class UuidShareDto {
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	uuid!: string;
}

export class TokenShareDto {
	@IsNotEmpty()
	@IsString()
	@IsUUID()
	token!: string;
}
