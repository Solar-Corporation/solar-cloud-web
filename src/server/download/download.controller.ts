import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { DownloadService } from './download.service';
import { DownloadDto } from './dto/download.dto';

@Controller()
export class DownloadController {
	constructor(
		private readonly downloadService: DownloadService,
	) {
	}

	@Get('download')
	async downloadLargeFile(
		@Query() file: DownloadDto,
		@Res() res: Response,
	) {
		await this.downloadService.download(file, res);
	}
}
