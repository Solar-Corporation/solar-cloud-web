import { Controller, Get, Render, UseInterceptors } from '@nestjs/common';
import { ParamsInterceptor } from './common/interceptors/params.interceptor';

@Controller()
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

	@Get('/')
	@Render('index')
	async home() {
		return {};
	}

	@Get('files')
	@Render('files')
	async files() {
		return {};
	}

	@Get('files/:directory')
	@Render('/files/[directory]')
	@UseInterceptors(ParamsInterceptor)
	async directory() {
		return {};
	}

	@Get('marked')
	@Render('marked')
	async marked() {
		return {};
	}

	@Get('trash')
	@Render('trash')
	async trash() {
		return {};
	}

	@Get('search')
	@Render('search')
	async search() {
		return {};
	}

	@Get('settings')
	@Render('settings')
	async settings() {
		return {};
	}
}
