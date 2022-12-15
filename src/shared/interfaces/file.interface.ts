import { Transaction } from 'sequelize';
import { FileUploadDto } from '../../server/file/dto/file.dto';
import { UserDto } from '../../server/user/dto/user.dto';

export interface IFile {
	saveFile(fileUploadDto: FileUploadDto, userDto: UserDto, transaction: Transaction): Promise<number>;
}
