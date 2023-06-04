import { Transform, Type } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsDate,
	IsHash,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { FileSystemStoredFile, IsFiles } from 'nestjs-form-data';
import { AbsolutePath } from '../../common/decorators/path-validate.decorator';


export class DirCreateDto {
	@IsOptional()
	@IsHash('md5')
	@IsString()
	hash: string = '';

	@IsString()
	@IsNotEmpty()
	@Transform(({ value }) => value.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-'))
	name!: string;
}

export class FileUploadDto {
	@IsFiles()
	@IsNotEmpty()
	files!: FileSystemStoredFile[];

	// @IsHash('md5')
	@IsString()
	@IsOptional()
	hash: string = '';

	@IsString()
	@IsOptional()
	@Transform(({ value }) => value.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-'))
	dir: string = '';
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

	stream?: any;

	@IsDate()
	createAt?: Date;

	@IsDate()
	updateAt?: Date;

	@IsBoolean()
	isDelete?: boolean;

	@IsDate()
	deleteAt?: Date;
}

export class HashDto {
	@IsOptional()
	hash: string = '';
}

export class HashesDto {
	@IsArray()
	@IsHash('md5', { each: true })
	@IsNotEmpty()
	hashes!: Array<string>;
}

export class MoveHashes {
	@IsArray()
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => MovePath)
	hashes!: Array<MovePath>;
}

export class SearchDto {
	@IsNotEmpty()
	@IsString()
	name!: string;
}

export class MovePath {
	@IsHash('md5')
	@IsString()
	hashFrom!: string;

	@IsString()
	hashTo: string = '';
}

export class RenameQueryDto {
	@IsString()
	@IsNotEmpty()
	// @Expose({ name: 'new_name' })
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
