import Head from 'next/head';
import { FC, ReactNode, useState } from 'react';
import styles from '../styles/components/AppLayout.module.css';
import { Header } from './Header';

interface AppLayoutProps {
  title: string;
  navbar: ReactNode;
  children: ReactNode;
}

export const AppLayout: FC<AppLayoutProps> = ({ title, navbar, children }) => {
  const [isFixed, setIsFixed] = useState(false);

  const setFixed = () => {
    if (window.scrollY >= 64) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', setFixed);
  }

  return (
    <>
      <Head>
        <title>{`${title} | SolarCloud`}</title>
        <meta name="description" content="description" />
        <meta charSet="utf-8" />
      </Head>
      <Header />
      <main className={styles.main}>
        <div
          className={
            isFixed ? `${styles.navbar} ${styles.fixed}` : styles.navbar
          }
        >
          {navbar}
        </div>
        <div className={styles.filler} hidden={!isFixed} />
        <div className={styles.container}>{children}</div>
      </main>
    </>
  );
};
