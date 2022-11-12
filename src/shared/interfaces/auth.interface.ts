import { Transaction } from 'sequelize';
import { JwtToken } from '../types/auth.type';

export interface IAuth<T> {
	login(
		loginOptions: T,
		transaction: Transaction,
	): Promise<JwtToken>;

	logout(refresh: string, transaction: Transaction): Promise<void>;

	refresh(refresh: string, transaction: Transaction): Promise<JwtToken>;
}
