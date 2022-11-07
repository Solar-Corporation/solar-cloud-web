import Head from 'next/head';
import { FC, ReactNode } from 'react';
import styles from '../styles/components/AppLayout.module.css';
import { Header } from './Header';

interface AppLayoutProps {
  title: string;
  navbar: ReactNode;
  children: ReactNode;
}

export const AppLayout: FC<AppLayoutProps> = ({ title, navbar, children }) => {
  return (
    <>
      <Head>
        <title>{`${title} | SolarCloud`}</title>
        <meta name="description" content="description" />
        <meta charSet="utf-8" />
      </Head>
      <Header />
      <main className={styles.main}>
        <div className={styles.navbar}>
          <div className={styles.navbarSticky}>{navbar}</div>
        </div>
        <div className={styles.container}>{children}</div>
      </main>
    </>
  );
};
