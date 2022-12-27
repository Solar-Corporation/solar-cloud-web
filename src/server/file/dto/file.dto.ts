import { Expose, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { FileSystemStoredFile, IsFiles } from 'nestjs-form-data';
import { Readable } from 'stream';
import { AbsolutePath } from '../../common/decorators/path-validate.decorator';


export class DirCreateDto {
	@IsString()
	@IsNotEmpty()
	@AbsolutePath()
	path!: string;

	@IsString()
	@IsNotEmpty()
	name!: string;
}

export class FileUploadDto {
	@IsFiles()
	@IsNotEmpty()
	files!: FileSystemStoredFile[];

	@IsString()
	@IsNotEmpty()
	@AbsolutePath()
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
	@AbsolutePath()
	path!: string;
}

export class PathsDto {
	@IsArray()
	@IsNotEmpty()
	@AbsolutePath()
	paths!: Array<string>;
}

export class MovePaths {
	@IsArray()
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => MovePath)
	paths!: Array<MovePath>;
}

export class MovePath {
	@IsString()
	@IsNotEmpty()
	@AbsolutePath()
	pathFrom!: string;

	@IsString()
	@IsNotEmpty()
	@AbsolutePath()
	pathTo!: string;
}

export class RenameQueryDto {
	@IsString()
	@IsNotEmpty()
	@Expose({ name: 'new_name' })
	@AbsolutePath()
	newName!: string;
}

export class RenameDto {
	@IsString()
	@IsNotEmpty()
	@AbsolutePath()
	path!: string;

	@IsString()
	@IsNotEmpty()
	@AbsolutePath()
	newName!: string;
}
