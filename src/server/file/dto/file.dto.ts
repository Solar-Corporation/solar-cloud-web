import { Expose } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsFile, MemoryStoredFile } from 'nestjs-form-data';
import { Readable } from 'stream';

export class FileUploadDto {
	@IsFile()
	file: MemoryStoredFile = new MemoryStoredFile;

	@IsString()
	filePath: string = '';
}

export class FileDto {
	@IsString()
	@IsNotEmpty()
	filePath: string = '';

	@IsNumber()
	@IsNotEmpty()
	sizeCompressed?: number = 0;

	@IsNumber()
	@IsNotEmpty()
	sizeActual: number = 0;

	@IsString()
	@IsNotEmpty()
	fileMime: string = '';

	@IsString()
	name?: string;

	@IsString()
	type?: string;

	stream?: Readable = new Readable();

	@IsDate()
	createAt?: Date;

	@IsDate()
	updateAt?: Date;

	@IsBoolean()
	isDelete?: boolean;

	@IsDate()
	deleteAt?: Date;
}

export class ParamFileDto {
	@IsString()
	@IsNotEmpty()
	@Expose({ name: 'file_path' })
	filePath: string = '';
}

export class ParamDirDto {
	@IsString()
	@IsNotEmpty()
	@Expose({ name: 'dir_path' })
	dirPath: string = '';
}

export class RenameDto {
	@IsString()
	@IsNotEmpty()
	@Expose({ name: 'new_name' })
	newName: string = '';
}

export class RenameFileDto {
	@IsString()
	@IsNotEmpty()
	filePath: string = '';

	@IsString()
	@IsNotEmpty()
	newName: string = '';
}
