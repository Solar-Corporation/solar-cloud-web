import { Sequelize } from 'sequelize';
import config from '../config/app.config';

const { database } = config();
export const SequelizeConnect = new Sequelize(database.name, database.username, database.password,
	{
		host: database.host,
		dialect: database.dialect,
		port: database.port,
		logging: false,
	},
);

