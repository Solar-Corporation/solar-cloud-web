import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { FileUploadDto } from './dto/file.dto';

@Controller({ version: '1' })
export class FileController {
	constructor() {

	}

	@Post('file/upload')
	@FormDataRequest()
	async saveFile(@Body() fileUploadDto: FileUploadDto): Promise<void> {
		console.log(fileUploadDto.file.buffer);
	}

	@Get()
	async getFile() {

	}

	@Put('file/rename')
	async renameFile() {

	}

	@Delete()
	async deleteFile() {

	}


	@Post()
	async createDirectory() {

	}

	@Put()
	async renameDirectory() {

	}

	@Delete()
	async deleteDirectory() {

	}

	@Get()
	async getFileTree() {

	}
}
