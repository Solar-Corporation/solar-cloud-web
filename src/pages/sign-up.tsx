import { Button, ConfigProvider, Form, Input, Typography } from 'antd';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { parseCookies } from 'nookies';
import Logo from '../client/img/logo.svg';
import { IRegister } from '../client/models/IAuth';
import { RouteNames } from '../client/router';
import { authAPI } from '../client/services/AuthService';
import styles from '../client/styles/pages/Signup.module.less';
import { variables } from '../client/styles/theme';

const { Text } = Typography;

export default function Signup() {
	const [registerUser, { isLoading }] = authAPI.useUserRegisterMutation();

	const handleSend = async (values: any) => {
		const data: IRegister = {
			email: values.email,
			password: values.password,
			fullName: {
				firstName: values.firstName,
				lastName: values.lastName,
				middleName: values.middleName || ''
			}
		};

		await registerUser(data);
	};

	return (
		<>
			<Head>
				<title>Регистрация | SolarCloud</title>
				<meta name="description" content="Корпоративное хранилище файлов"/>
				<meta charSet="utf-8"/>
			</Head>
			<main className={styles.main}>
				<div className={styles.container}>
					<Image src={Logo} alt="" className={styles.logo} priority/>
					<h1 className={styles.title}>
						Регистрация
					</h1>
					<Form
						className={styles.form}
						name="register"
						layout="vertical"
						size="large"
						validateMessages={{ required: 'Обязательное поле' }}
						onFinish={handleSend}
					>
						<Form.Item name="lastName" rules={[{ required: true }]}>
							<Input placeholder="Фамилия"/>
						</Form.Item>
						<Form.Item name="firstName" rules={[{ required: true }]}>
							<Input placeholder="Имя"/>
						</Form.Item>
						<Form.Item name="middleName">
							<Input placeholder="Отчество"/>
						</Form.Item>
						<Form.Item
							name="email"
							rules={[
								{ required: true },
								{ type: 'email', message: 'Неверный формат E-mail' }
							]}
							hasFeedback
						>
							<Input placeholder="Ваша почта"/>
						</Form.Item>
						<Form.Item
							name="password"
							rules={[{ required: true }]}
							hasFeedback
						>
							<Input.Password placeholder="Пароль"/>
						</Form.Item>
						<Form.Item
							name="confirmPassword"
							dependencies={['password']}
							rules={[
								{ required: true },
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!value || getFieldValue('password') === value) {
											return Promise.resolve();
										}
										return Promise.reject(new Error('Пароли не совпадают'));
									}
								})
							]}
							hasFeedback
						>
							<Input.Password placeholder="Подтверждение пароля"/>
						</Form.Item>
						<Form.Item className={styles.control}>
							<ConfigProvider
								theme={{
									token: {
										colorLink: variables['@gold-primary'],
										colorLinkHover: variables['@gold-secondary'],
										colorLinkActive: variables['@gold-secondary']
									},
									components: {
										Button: {
											colorPrimary: variables['@orange-primary'],
											colorPrimaryHover: variables['@orange-secondary'],
											colorPrimaryActive: variables['@orange-secondary']
										}
									}
								}}
							>
								<Button
									className={styles.button}
									type="primary"
									size="large"
									htmlType="submit"
									loading={isLoading}
									block
								>
									Зарегистрироваться
								</Button>
								<Text type="secondary" className={styles.login}>
									Уже есть аккаунт? <Link href={RouteNames.LOGIN}>Войти</Link>
								</Text>
							</ConfigProvider>
						</Form.Item>
					</Form>
				</div>
			</main>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { refreshToken: token } = parseCookies(ctx);

	if (token) {
		return {
			redirect: {
				permanent: true,
				destination: RouteNames.FILES
			}
		};
	}

	return { props: {} };
};