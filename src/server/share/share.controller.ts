import {
	Controller,
	Delete,
	Get,
	Headers,
	Param,
	Post,
	Query,
	Req,
	Res,
	StreamableFile,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AddShareDto, TokenShareDto, UuidShareDto } from './dto/share.dto';
import { ShareService } from './share.service';

@Controller({ version: '1', path: 'share' })
export class ShareController {

	constructor(
		private readonly shareService: ShareService,
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
	async userShare(
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
		@Param() { uuid }: UuidShareDto,
		@Query() { token }: TokenShareDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<StreamableFile> {
		const { fileMime, stream, name } = await this.shareService.getFile(uuid, token);
		// @ts-ignore
		res.set({
			'Content-Type': `${fileMime}; charset=utf-8`,
			'Content-Disposition': `attachment; filename="${encodeURI(name!)}"`,
		});
		return new StreamableFile(stream);
	}

}
