import { Injectable } from '@nestjs/common';
import { QueryTypes, Transaction } from 'sequelize';
import { SequelizeConnect } from '../database/database-connect';

@Injectable()
export class TrashDatabaseService {

	async getDeleteFiles(uuid: string): Promise<Array<string>> {
		const [paths]: any = await SequelizeConnect.query(`SELECT file_data.get_delete_files('${uuid}');`, {
			nest: true,
			type: QueryTypes.SELECT,
		});
		return paths.get_delete_files || [];
	}

	async restoreDeleteFiles(path: Array<string>, transaction: Transaction): Promise<void> {
		await SequelizeConnect.query(`CALL file_data.restore_paths('{${path}}');`, {
			transaction: transaction,
		});
	}

	async deleteFiles(uuid: string, transaction: Transaction): Promise<Array<string>> {
		const [paths]: any = await SequelizeConnect.query(`SELECT file_data.delete_user_paths('${uuid}');`, {
				transaction: transaction,
				type: QueryTypes.SELECT,
			},
		);
		return paths.delete_user_paths || [];
	}
}
