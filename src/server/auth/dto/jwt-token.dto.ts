import { IsDate, IsIP, IsJWT, IsNotEmpty, IsNotEmptyObject, IsNumber } from 'class-validator';
import { UserDto } from '../../user/dto/user.dto';

export class JwtTokenDto {
	@IsNotEmpty()
	readonly refresh: string = '';

	readonly access: string = '';
}

export class TokenPayloadDto extends UserDto {
}

export class DeviceDataDto {
	@IsNotEmpty()
	@IsIP()
	deviceIp: string = '';

	@IsNotEmpty()
	@IsNotEmptyObject()
	deviceUa: object = {};
}

export class RefreshTokenDto {
	@IsNotEmpty()
	@IsJWT()
	refreshToken: string = '';

	@IsNotEmpty()
	@IsNumber()
	userId: number = 0;

	@IsNotEmpty()
	@IsIP()
	deviceIp: string = '';

	@IsNotEmpty()
	@IsNotEmptyObject()
	deviceUa: object = {};

	@IsNotEmpty()
	@IsDate()
	dateExpired?: Date;
}

