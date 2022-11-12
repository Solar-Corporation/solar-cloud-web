import { Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { IAuth } from '../../shared/interfaces/auth.interface';
import { EmailLoginOptions, JwtToken } from '../../shared/types/auth.type';

@Injectable()
export class AuthService implements IAuth<EmailLoginOptions> {
	/**
	 *
	 * @param {LoginOptions} loginOptions
	 * @param {} transaction
	 * @return {Promise<JwtToken>}
	 */
	async login(
		loginOptions: EmailLoginOptions,
		transaction: Transaction,
	): Promise<JwtToken> {
		return { refresh: '', access: '' };
	}

	/**
	 *
	 * @param {string} refresh
	 * @param {} transaction
	 * @return {Promise<void>}
	 */
	async logout(refresh: string, transaction: Transaction): Promise<void> {
	}

	/**
	 *
	 * @param {string} refresh
	 * @param {} transaction
	 * @return {Promise<JwtToken>}
	 */
	async refresh(
		refresh: string,
		transaction: Transaction,
	): Promise<JwtToken> {
		return { refresh: '', access: '' };
	}
}
