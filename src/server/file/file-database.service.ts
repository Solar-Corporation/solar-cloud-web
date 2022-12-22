import { Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { SequelizeConnect } from '../database/database-connect';
import { FileDto, RenameDto } from './dto/file.dto';

@Injectable()
export class FileDatabaseService {
	async addFile(fileDto: FileDto, userId: number, transaction: Transaction): Promise<number> {
		const fileId: any = await SequelizeConnect.query(`SELECT file_data.add_user_file('${JSON.stringify(fileDto)}', ${userId})`,
			{ transaction: transaction });
		return fileId[0][0].add_user_file;
	}

	async updateFilePath(renameFileDto: RenameDto, transaction: Transaction): Promise<void> {
		await SequelizeConnect.query(`CALL file_data.update_file('${renameFileDto.path}','${renameFileDto.newName}')`,
			{ transaction: transaction });
	}

	async getFile(filePath: string): Promise<FileDto> {
		const file: any = await SequelizeConnect.query(`SELECT file_data.get_file('${filePath}')`);
		return file[0][0].get_file;
	}
}
