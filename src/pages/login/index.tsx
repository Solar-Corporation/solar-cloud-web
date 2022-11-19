import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../client/img/logo.svg';
import styles from '../../client/styles/pages/Login.module.less';

const { Text } = Typography;

export default function Login() {
	return (
		<>
			<Head>
				<title>Вход в аккаунт | SolarCloud</title>
				<meta name="description" content="description" />
				<meta charSet="utf-8" />
			</Head>
			<main className={styles.main}>
				<div className={styles.container}>
					<Image src={Logo} alt="" className={styles.logo} />
					<h1 className={styles.title}>
						Вход в аккаунт
					</h1>
					<Form layout="vertical" className={styles.form}>
						<Form.Item>
							<Input
								prefix={<UserOutlined />}
								placeholder="Ваша почта"
								size="large"
							/>
						</Form.Item>
						<Form.Item className={styles.password}>
							<Form.Item name="password" className={styles.passwordInput}>
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
