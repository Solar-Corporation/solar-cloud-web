import { Expose } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsFile, MemoryStoredFile } from 'nestjs-form-data';
import { Readable } from 'stream';

export class DirCreateDto {
	@IsString()
	@IsNotEmpty()
	path!: string;

	@IsString()
	@IsNotEmpty()
	name!: string;
}

export class FileUploadDto {
	@IsFile()
	@IsNotEmpty()
	file!: MemoryStoredFile;

	@IsString()
	@IsNotEmpty()
	path!: string;
}

export class FileDto {
	@IsString()
	@IsNotEmpty()
	filePath!: string;

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

export class PathDto {
	@IsString()
	@IsNotEmpty()
	@Expose({ name: 'path' })
	path!: string;
}

export class PathsDto {
	@IsArray()
	@IsNotEmpty()
	paths!: Array<string>;
}

export class MovePaths {
	@IsArray()
	@IsNotEmpty()
	paths!: Array<MovePath>;
}

export class MovePath {
	@IsString()
	@IsNotEmpty()
	pathFrom!: string;

	@IsString()
	@IsNotEmpty()
	pathTo!: string;
}

export class RenameQueryDto {
	@IsString()
	@IsNotEmpty()
	@Expose({ name: 'new_name' })
	newName!: string;
}

export class RenameDto {
	@IsString()
	@IsNotEmpty()
	path!: string;

	@IsString()
	@IsNotEmpty()
	newName!: string;
}
