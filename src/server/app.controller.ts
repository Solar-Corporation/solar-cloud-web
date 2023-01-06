import { Controller, Get, Render, UseInterceptors } from '@nestjs/common';
import { ParamsInterceptor } from './common/interceptors/params.interceptor';

@Controller()
@UseInterceptors(ParamsInterceptor)
export class AppController {

	@Get('sign-up')
	@Render('sign-up')
	async registration() {
		return {};
	}

	@Get('sign-in')
	@Render('sign-in')
	async emailLogin() {
		return {};
	}

	@Get('sign-out')
	@Render('sign-out')
	async logout() {
		return {};
	}

	@Get('cloud')
	@Render('cloud')
	async cloud() {
		return {};
	}

	@Get('/')
	@Render('index')
	async home() {
		return {};
	}
}
