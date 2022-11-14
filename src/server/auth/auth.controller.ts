import { Body, Controller, Delete, Get, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize';
import { UAParser } from 'ua-parser-js';
import { JwtToken } from '../../shared/types/auth.type';
import { TransactionParam } from '../common/decorators/transaction.decorator';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { AuthService } from './auth.service';
import { DeviceDataDto, EmailLoginDto, UserRegistrationDto } from './dto';

@Controller({ version: '1' })
export class AuthController {

	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {
	}

	@Post('registration')
	@UseInterceptors(TransactionInterceptor)
	async registration(
		@Body() registrationUserDto: UserRegistrationDto,
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@TransactionParam() transaction: Transaction,
	): Promise<JwtToken> {
		const { headers, socket } = req;
		const deviceData: DeviceDataDto = {
			deviceIp: (headers['x-forwarded-for']) ? (headers['x-forwarded-for']).toString() : socket.remoteAddress || '',
			deviceUa: UAParser(headers['user-agent']),
		};

		const tokens = await this.authService.registration(registrationUserDto, deviceData, transaction);

		const refreshMaxAgeInSeconds = Number(this.configService.get<number>('auth.refreshExpiresIn'));
		const milliseconds = 1000;
		res.cookie('refreshToken', tokens.refresh, { maxAge: refreshMaxAgeInSeconds * milliseconds, httpOnly: true });

		return tokens;
	}

	@Post('auth/email')
	@UseInterceptors(TransactionInterceptor)
	async emailLogin(
		@Body() emailLoginDto: EmailLoginDto,
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@TransactionParam() transaction: Transaction,
	): Promise<JwtToken> {
		const { headers, socket } = req;
		const deviceData: DeviceDataDto = {
			deviceIp: (headers['x-forwarded-for']) ? (headers['x-forwarded-for']).toString() : socket.remoteAddress || '',
			deviceUa: UAParser(headers['user-agent']),
		};

		const tokens = await this.authService.login(emailLoginDto, deviceData, transaction);

		const refreshMaxAgeInSeconds = Number(this.configService.get<number>('auth.refreshExpiresIn'));
		const milliseconds = 1000;
		res.cookie('refreshToken', tokens.refresh, { maxAge: refreshMaxAgeInSeconds * milliseconds, httpOnly: true });

		return tokens;
	}

	@Delete('logout')
	@UseInterceptors(TransactionInterceptor)
	async logout(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@TransactionParam() transaction: Transaction,
	): Promise<void> {
		const { cookies: { refreshToken } } = req;
		await this.authService.logout(refreshToken, transaction);
		res.clearCookie('refreshToken');
	}

	@Get('refresh')
	async refresh(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	): Promise<JwtToken> {
		const { cookies: { refreshToken } } = req;
		return await this.authService.refresh(refreshToken);
	}
}
