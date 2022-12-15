import { Button } from 'antd';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../client/img/logo.svg';
import styles from '../client/styles/pages/Home.module.less';

export default function Home() {
	return (
		<>
			<Head>
				<title>SolarCloud</title>
				<meta name="description" content="description" />
				<meta charSet="utf-8" />
			</Head>
			<main className={styles.main}>
				<div className={styles.container}>
					<Image src={Logo} alt="" className={styles.image} />
					<Link href="/cloud">
						<Button type="primary" size="large">
							Перейти в облако
						</Button>
					</Link>
				</div>
			</main>
		</>
	);
}