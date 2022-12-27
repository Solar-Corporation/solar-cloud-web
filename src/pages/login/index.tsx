import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Form, Input, Typography } from 'antd';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Logo from '../../client/img/logo.svg';
import { IAuth } from '../../client/models/IAuth';
import { RouteNames } from '../../client/router';
import { authAPI } from '../../client/services/AuthService';
import styles from '../../client/styles/pages/Login.module.less';
import { variables } from '../../client/styles/theme';
import { hash } from '../../client/utils';

const { Text } = Typography;

export default function Login() {
	const router = useRouter();
	const [loginUser, { data, isLoading }] = authAPI.useUserLoginMutation();

	const handleSend = async (values: IAuth) => {
		await loginUser({ ...values, password: await hash(values.password) });
	};

	useEffect(() => {
		if (data) {
			router.push(RouteNames.CLOUD);
		}
	}, [data]);

	return (
		<>
			<Head>
				<title>Вход в аккаунт | SolarCloud</title>
				<meta name="description" content="description" />
				<meta charSet="utf-8" />
			</Head>
			<main className={styles.main}>
				<div className={styles.container}>
					<Image src={Logo} alt="" className={styles.logo} priority />
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
								prefix={<UserOutlined />}
								placeholder="Ваша почта"
								size="large"
							/>
						</Form.Item>
						<Form.Item className={styles.password} required>
							<Form.Item className={styles.passwordInput} name="password" rules={[{ required: true }]}>
								<Input.Password
									prefix={<LockOutlined />}
									placeholder="Пароль"
									size="large"
								/>
							</Form.Item>
							<Link href="/">
								Забыли пароль?
							</Link>
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
