import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Form, Input, Typography } from 'antd';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import Logo from '../client/img/logo.svg';
import { IAuth } from '../client/models/IAuth';
import { RouteNames } from '../client/router';
import { authAPI } from '../client/services/AuthService';
import styles from '../client/styles/pages/Login.module.less';
import { variables } from '../client/styles/theme';

const { Text } = Typography;

export default function SignIn() {
	const [loginUser, { isLoading }] = authAPI.useUserLoginMutation();
	const redirect = useSearchParams().get('return_to');
	const router = useRouter();

	const handleSend = async (values: IAuth) => {
		try {
			await loginUser(values).unwrap();
			await router.push(redirect || RouteNames.FILES);
		} catch (e) {
		}
	};

	return (
		<>
			<Head>
				<title>Вход в аккаунт | SolarCloud</title>
				<meta name="description" content="Корпоративное хранилище файлов"/>
				<meta charSet="utf-8"/>
			</Head>
			<main className={styles.main}>
				<div className={styles.container}>
					<Image src={Logo} alt="" className={styles.logo} priority/>
					<h1 className={styles.title}>
						Вход в аккаунт
					</h1>
					<Form
						className={styles.form}
						name="login"
						layout="vertical"
						validateMessages={{ required: '' }}
						onFinish={handleSend}
					>
						<Form.Item name="email" rules={[{ required: true }]}>
							<Input
								prefix={<UserOutlined/>}
								placeholder="Ваша почта"
								size="large"
							/>
						</Form.Item>
						<Form.Item className={styles.password} required>
							<Form.Item className={styles.passwordInput} name="password" rules={[{ required: true }]}>
								<Input.Password
									prefix={<LockOutlined/>}
									placeholder="Пароль"
									size="large"
								/>
							</Form.Item>
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
									Войти
								</Button>
								<Text type="secondary" className={styles.register}>
									Нет аккаунта? <Link href={RouteNames.SIGNUP}>Зарегестрироваться</Link>
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