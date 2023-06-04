import { Controller, Delete, Get, Headers, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { FileService } from '../file/file.service';
import { AddShareDto, TokenShareDto, UuidShareDto } from './dto/share.dto';
import { ShareService } from './share.service';

@Controller({ version: '1', path: 'share' })
export class ShareController {

	constructor(
		private readonly shareService: ShareService,
		private readonly fileService: FileService,
	) {

	}

	@Post('/:hash')
	@UseGuards(AuthGuard())
	async addShare(
		@Headers() headers: any,
		@Param() { hash }: AddShareDto,
		@Req() { user }: any,
	): Promise<{ url: string }> {
		const token = await this.shareService.addShare(user, hash);
		const url = `http://${headers.host}/v1/share/${user.uuid}/download?token=${token}`;
		return {
			url: url,
		};
	}

	@Delete('/:hash')
	@UseGuards(AuthGuard())
	async deleteShare(
		@Param() { hash }: AddShareDto,
		@Req() { user }: any,
	) {
		await this.shareService.deleteShare(user, hash);
	}

	@Get('/:hash')
	@UseGuards(AuthGuard())
	async copyShare(
		@Headers() headers: any,
		@Param() { hash }: AddShareDto,
		@Req() { user }: any,
	) {
		const token = await this.shareService.getShareToken(user, hash);
		const url = `http://${headers.host}/v1/share/${user.uuid}/download?token=${token}`;
		return {
			url: url,
		};
	}

	@Get('/:uuid/download?')
	async getFile(
		@Headers() headers: any,
		@Param() { uuid }: UuidShareDto,
		@Query() { token }: TokenShareDto,
		@Res() res: Response,
	) {
		const file = await this.shareService.getFile(uuid, token);
		const { name, token: downloadToken } = await this.fileService.downloadSaveLargeFiles(file);
		const url = `http://${headers.host}/download?token=${downloadToken}&name=${name}`;
		res.redirect(url);
	}

}
