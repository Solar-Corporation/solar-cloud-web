import { Type } from 'class-transformer';
import {
	IsDate,
	IsEmail,
	IsHash,
	IsNotEmpty,
	IsNotEmptyObject,
	IsNumber,
	IsString,
	IsUrl,
	ValidateNested,
} from 'class-validator';

export class FullNameDto {
	@IsString()
	@IsNotEmpty()
	firstName?: string;

	@IsString()
	middleName?: string;

	@IsString()
	@IsNotEmpty()
	lastName?: string;
}

export class UserDto {
	@IsNumber()
	@IsNotEmpty()
	id: number = 0;

	@IsString()
	@IsNotEmpty()
	uuid: string = '';

	@IsEmail()
	email: string = '';

	@IsString()
	@IsNotEmpty()
	nickname: string = '';

	@IsNotEmpty()
	@IsNotEmptyObject()
	@ValidateNested()
	@Type(() => FullNameDto)
	fullName?: FullNameDto;

	@IsUrl()
	imageUrl?: string;

	@IsNotEmpty()
	@IsDate()
	createAt?: Date;

	@IsNotEmpty()
	@IsDate()
	updateAt?: Date;
}

export class UserAuthDto extends UserDto {
	@IsNotEmpty()
	@IsHash('sha256')
	password!: string;
}

export class UserIdDto {
	@IsNotEmpty()
	@Type(() => Number)
	@IsNumber()
	userId!: number;
}
