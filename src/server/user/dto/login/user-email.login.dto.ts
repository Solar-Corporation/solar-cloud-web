// import { IsNotEmpty } from 'class-validator';

import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailLoginDto {

	@IsEmail()
	email: string;

	@IsNotEmpty()
	readonly password: string;
}
