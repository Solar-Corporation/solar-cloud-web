import { Type } from 'class-transformer';
import { IsEmail, IsHash, IsNotEmpty, IsNotEmptyObject, IsString, MinLength, ValidateNested } from 'class-validator';
import { FullNameDto } from '../../user/dto/user.dto';

export class UserRegistrationDto {
	@IsEmail()
	email: string = '';

	@IsString()
	@IsHash('sha256')
	@IsNotEmpty()
	@MinLength(8)
	password: string = '';

	@IsNotEmpty()
	@IsNotEmptyObject()
	@ValidateNested()
	@Type(() => FullNameDto)
	fullName?: FullNameDto;
}
