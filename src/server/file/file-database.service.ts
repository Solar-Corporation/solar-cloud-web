import { Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { DeleteMarked } from '../../../solar-s3';
import { SequelizeConnect } from '../database/database-connect';
import { RenameDto } from './dto/file.dto';

@Injectable()
export class FileDatabaseService {

	async updateFilePath(renameFileDto: RenameDto, transaction: Transaction): Promise<void> {
		await SequelizeConnect.query(`CALL file_data.update_file('${renameFileDto.path}','${renameFileDto.newName}')`,
			{ transaction: transaction });
	}

	async markAsDelete(deleteMarked: DeleteMarked, transaction: Transaction): Promise<void> {
		await SequelizeConnect.query(`CALL file_data.mark_path_as_delete('${deleteMarked.path}', '${deleteMarked.time.toISOString()}', ${deleteMarked.isDir})`, {
			transaction: transaction,
		});
	}
}
