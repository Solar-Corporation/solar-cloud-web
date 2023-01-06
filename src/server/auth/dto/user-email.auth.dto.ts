import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailLoginDto {

	@IsEmail()
	email!: string;

	@IsNotEmpty()
	password!: string;
}
