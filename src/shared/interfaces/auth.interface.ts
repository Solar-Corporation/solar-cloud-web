import { Transaction } from 'sequelize';
import { DeviceDataDto, UserRegistrationDto } from '../../server/auth/dto';
import { JwtToken } from '../types/auth.type';

export interface IAuth<T> {
	registration(
		registrationUserDto: UserRegistrationDto,
		deviceDataDto: DeviceDataDto,
		transaction: Transaction,
	): Promise<JwtToken>;

	login(
		loginOptions: T,
		deviceDataDto: DeviceDataDto,
		transaction: Transaction,
	): Promise<JwtToken>;

	logout(
		refresh: string,
		transaction: Transaction): Promise<void>;

	refresh(refresh: string): Promise<JwtToken>;
}
