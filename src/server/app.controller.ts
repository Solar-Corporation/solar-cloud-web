import { Controller, Get, Param, Render, Req, Res, UseInterceptors } from '@nestjs/common';
import path from 'path';
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


	@Get('img/*')
	serveStaticImg(
		@Req() req: any,
		@Res() res: any,
	) {
		const filePath = path.join(__dirname, '..', 'public', 'img', req.url);
		return res.sendFile(filePath);
	}


	@Get('files/:directory')
	@Render('files/[directory]')
	async directory(
		@Param() { directory }: any,
		@Res() res: any,
	) {
		return res.render(`files/${directory}`);
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
