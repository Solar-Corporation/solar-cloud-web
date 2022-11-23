import 'dotenv/config';
import { Dialect } from 'sequelize';

export default () => ({
	auth: {
		secretKey: process.env.JWT_KEY_SECRET,
		accessExpiresIn: Number(process.env.EXPIRESIN_ACCESS_SECRET),
		refreshExpiresIn: Number(process.env.EXPIRESIN_REFRESH_SECRET),
	},
	app: {
		port: process.env.APP_PORT_SECRET || 3000,
		path: process.env.STORE_PATH_SECRET,
	},
	database: {
		dialect: process.env.DATABASE_DIALECT_SECRET as Dialect,
		port: Number(process.env.DATABASE_PORT_SECRET),
		host: process.env.DATABASE_HOST_SECRET,
		username: process.env.DATABASE_USERNAME_SECRET || '',
		password: process.env.DATABASE_PASSWORD_SECRET,
		name: process.env.DATABASE_NAME_SECRET || '',
	},
})
