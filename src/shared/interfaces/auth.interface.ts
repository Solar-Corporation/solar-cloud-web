import { Transaction } from 'sequelize';
import { DeviceDataDto, RegistrationUserDto } from '../../server/auth/dto';
import { JwtToken } from '../types/auth.type';

export interface IAuth<T> {
	registration(registrationUserDto: RegistrationUserDto, deviceDataDto: DeviceDataDto, transaction: Transaction): Promise<JwtToken>;

	login(
		loginOptions: T,
		transaction: Transaction,
	): Promise<JwtToken>;

	logout(refresh: string, transaction: Transaction): Promise<void>;

	refresh(refresh: string, transaction: Transaction): Promise<JwtToken>;
}
