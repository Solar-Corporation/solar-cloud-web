import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
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
						layout="vertical"
						onFinish={handleSend}
					>
						<Form.Item name="email" rules={[{ required: true, message: '' }]}>
							<Input
								prefix={<UserOutlined />}
								placeholder="Ваша почта"
								size="large"
							/>
						</Form.Item>
						<Form.Item className={styles.password} required>
							<Form.Item className={styles.passwordInput} name="password" rules={[{ required: true, message: '' }]}>
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
								Нет аккаунта? <Link href="/">Зарегестрироваться</Link>
							</Text>
						</Form.Item>
					</Form>
				</div>
			</main>
		</>
	);
}
