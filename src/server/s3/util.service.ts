import { promises as fs } from 'fs';

export class UtilService {
	async isExist(pathCheck: string): Promise<boolean> {
		try {
			await fs.access(pathCheck);
			return true;
		} catch (err) {
			return false;
		}
	}

	async getTablesArr(): Promise<Array<string>> {
		const sql: Array<string> = [];
		const tables = await fs.readFile('./src/server/s3/sql/create_tables.sql');
		tables.toString('utf8').replace(/\n/g, '').split(';').forEach((script) => {
			if (script !== '')
				sql.push(script);
		});
		return sql;
	}

	async clearPath(fullPath: string): Promise<string> {
		const re = /.*([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})(\/files\/)/;
		return fullPath.replace(re, '').slice(0, -1);
	}

	async replaceLast(str: string, search: string, replace: string) {
		const index = str.lastIndexOf(search);
		if (index === -1)
			return str;
		return str.substring(0, index) + replace + str.substring(index + search.length);
	}

	async addDays(date: Date, days: number): Promise<Date> {
		const result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}

	async convert(bytes: number) {
		const sizes = ['Байт', 'КБ', 'МБ', 'ГБ', 'ТБ'];

		if (bytes == 0) {
			return 'n/a';
		}

		const i = Number(Math.floor(Math.log(bytes) / Math.log(1024)));

		if (i == 0) {
			return bytes + ' ' + sizes[i];
		}

		return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
	}


}
