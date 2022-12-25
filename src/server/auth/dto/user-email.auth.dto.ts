import { IsEmail, IsHash, IsNotEmpty } from 'class-validator';

export class EmailLoginDto {

	@IsEmail()
	email!: string;

	@IsNotEmpty()
	@IsHash('sha256')
	password!: string;
}
