import { Body, Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize';
import { UAParser } from 'ua-parser-js';
import { JwtToken } from '../../shared/types/auth.type';
import { SequelizeConnect } from '../database/database-connect';
import { AuthService } from './auth.service';
import { DeviceDataDto, EmailLoginDto, RegistrationUserDto } from './dto';

@Controller({ version: '1' })
export class AuthController {

	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {
	}

	@Post('registration')
	async registration(@Body() registrationUserDto: RegistrationUserDto, @Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<JwtToken> {
		const transaction: Transaction = await SequelizeConnect.transaction();
		try {
			const { headers, socket } = req;
			const deviceData: DeviceDataDto = {
				deviceIp: (headers['x-forwarded-for']) ? (headers['x-forwarded-for']).toString() : socket.remoteAddress || '',
				deviceUa: UAParser(headers['user-agent']),
			};

			const tokens = await this.authService.registration(registrationUserDto, deviceData, transaction);

			const refreshMaxAgeInSeconds = Number(this.configService.get<number>('auth.refreshExpiresIn'));
			const milliseconds = 1000;
			res.cookie('refreshToken', tokens.refresh, { maxAge: refreshMaxAgeInSeconds * milliseconds, httpOnly: true });

			await transaction.commit();
			return tokens;
		} catch (err) {
			await transaction.rollback();
			throw err;
		}
	}

	@Post('auth/email')
	async emailLogin(@Body() emailLogin: EmailLoginDto): Promise<JwtToken> {

		return { access: emailLogin.email, refresh: emailLogin.password };
	}

	@Delete('logout')
	async logout(@Req() req: Request): Promise<void> {

	}

	@Get('refresh')
	async refresh(@Req() req: Request, @Res() res: Response): Promise<JwtToken> {
		// const { cookies: { refresh_token } } = req;
		//
		// res.cookie('refresh_token', 'test', {maxAge: ,httpOnly: true})
		return { access: '', refresh: '' };
	}
}
