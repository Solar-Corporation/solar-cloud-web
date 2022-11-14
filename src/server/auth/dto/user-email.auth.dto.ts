import { IsEmail, IsHash, IsNotEmpty } from 'class-validator';

export class EmailLoginDto {

	@IsEmail()
	readonly email: string = '';

	@IsNotEmpty()
	@IsHash('sha256')
	readonly password: string = '';
}
