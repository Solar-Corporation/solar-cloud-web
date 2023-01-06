import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested } from 'class-validator';
import { FullNameDto } from '../../user/dto/user.dto';

export class UserRegistrationDto {
	@IsEmail()
	@IsNotEmpty()
	email!: string;

	@IsString()
	@IsNotEmpty()
	password!: string;

	@IsNotEmpty()
	@IsNotEmptyObject()
	@ValidateNested()
	@Type(() => FullNameDto)
	fullName!: FullNameDto;
}
