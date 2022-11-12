export default () => ({
	auth: {
		secretKey: process.env.JWT_KEY_SECRET || 'TEST',
		expiresIn: process.env.EXPIRESIN_SECRET,
	},
	app: {
		port: process.env.APP_PORT_SECRTET || 3000,
	},
})
