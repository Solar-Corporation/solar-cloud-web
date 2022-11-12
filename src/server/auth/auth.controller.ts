import { Body, Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtToken } from '../../shared/types/auth.type';
import { EmailLoginDto } from '../user/dto/login/user-email.login.dto';

@Controller({ version: '1' })
export class AuthController {
	@Post('login/email')
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
