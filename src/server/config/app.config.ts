import 'dotenv/config';
import { Dialect } from 'sequelize';

export default () => ({
	auth: {
		accessSecretKey: process.env.JWT_ACCESS_KEY_SECRET,
		refreshSecretKey: process.env.JWT_REFRESH_KEY_SECRET,
		accessExpiresIn: Number(process.env.EXPIRESIN_ACCESS_SECRET),
		refreshExpiresIn: Number(process.env.EXPIRESIN_REFRESH_SECRET),
	},
	app: {
		name: process.env.STORE_NAME_SECRET,
		port: process.env.APP_PORT_SECRET || 3000,
		path: process.env.STORE_PATH_SECRET,
		userStorage: process.env.USER_STORAGE_SECRET || 5368709120,
		isRegistration: process.env.IS_REGISTRATION_SECRET || true,
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
