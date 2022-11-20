import { IsNotEmpty, IsString } from 'class-validator';
import { IsFile, MemoryStoredFile } from 'nestjs-form-data';

export class FileUploadDto {
	@IsFile()
	file: MemoryStoredFile = new MemoryStoredFile;

	@IsString()
	@IsNotEmpty()
	file_path: string = '';
}
