import Head from 'next/head';
import { FC, ReactNode } from 'react';
import styles from '../styles/components/Layout.module.css';
import { Header } from './Header';

interface AppLayoutProps {
	title: string;
	sidebarTop?: ReactNode;
	sidebarBottom?: ReactNode;
	children: ReactNode;
}

export const Layout: FC<AppLayoutProps> = ({ title, sidebarTop, sidebarBottom, children }) => {
	return (
		<>
			<Head>
				<title>{`${title} | SolarCloud`}</title>
				<meta name="description" content="description" />
				<meta charSet="utf-8" />
			</Head>
			<Header />
			<main className={styles.main}>
				{
					(sidebarTop || sidebarBottom) &&
          <div className={styles.sidebar}>
						{sidebarTop && <div className={styles.stickyTop}>{sidebarTop}</div>}
						{sidebarBottom && <div className={styles.stickyBottom}>{sidebarBottom}</div>}
          </div>
				}
				<div className={styles.container}>{children}</div>
			</main>
		</>
	);
};
