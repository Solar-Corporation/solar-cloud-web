import { Body, Controller, Delete, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { HashesDto } from '../file/dto/file.dto';
import { Properties } from '../s3/item.service';
import { UserDto } from '../user/dto/user.dto';
import { TrashService } from './trash.service';

@Controller({ version: '1' })
export class TrashController {

	constructor(
		private readonly trashService: TrashService,
	) {
	}

	@Get('trash')
	@UseGuards(AuthGuard())
	async getDeleteFiles(
		@Req() { user }: Request,
	): Promise<Array<Properties>> {
		return await this.trashService.getDeleteFiles(user as UserDto);
	}

	@Put('trash')
	@UseGuards(AuthGuard())
	async restoreFiles(
		@Body() { hashes }: HashesDto,
		@Req() { user }: Request,
	): Promise<void> {
		await this.trashService.restoreDeleteFiles(user as UserDto, hashes);
	}

	@Delete('trash')
	@UseGuards(AuthGuard())
	async clearFiles(
		@Req() { user }: Request,
	): Promise<void> {
		await this.trashService.deletePaths(user as UserDto);
	}

}
