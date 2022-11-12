import { IsNotEmpty } from 'class-validator';

export class JwtTokenDto {
	@IsNotEmpty()
	readonly refresh: string = '';

	readonly access: string = '';
}
