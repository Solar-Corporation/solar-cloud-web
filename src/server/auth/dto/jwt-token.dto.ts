import { IsNotEmpty } from 'class-validator';
import { UserDto } from '../../user/dto/user.dto';

export class JwtTokenDto {
	@IsNotEmpty()
	readonly refresh: string = '';

	readonly access: string = '';
}

export class TokenPayloadDto extends UserDto {

}
