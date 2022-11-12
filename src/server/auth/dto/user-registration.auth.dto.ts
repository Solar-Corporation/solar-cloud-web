import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsString, MinLength, ValidateNested } from 'class-validator';

export class FullNameDto {
	@IsString()
	@IsNotEmpty()
	firstName?: string;

	@IsString()
	@IsNotEmpty()
	middleName?: string;

	@IsString()
	@IsNotEmpty()
	lastName?: string;
}

export class RegistrationUserDto {
	@IsEmail()
	email: string = '';

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password?: string;

	@IsNotEmpty()
	@IsNotEmptyObject()
	@ValidateNested()
	@Type(() => FullNameDto)
	fullName?: FullNameDto;
}
