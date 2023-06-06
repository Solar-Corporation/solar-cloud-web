import { Controller, Get, Param, Render, Res, UseInterceptors } from '@nestjs/common';
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
	@Render('files/[directory]')
	async directory() {
		return {};
	}

	@Get('files/:directory/test')
	@Render('files/[directory]')
	async directoryTest(
		@Param() test: any,
		@Res() res: any,
	) {
		return res.render(`files/${test.directory}`);
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
