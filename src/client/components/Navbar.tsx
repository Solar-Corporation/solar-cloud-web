import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';
import styles from '../styles/components/Navbar.module.css';

export interface INavbarItem {
  icon: ReactNode;
  title: string;
  href: string;
}

interface NavbarProps {
  links: INavbarItem[];
}

export const Navbar: FC<NavbarProps> = ({ links }) => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          className={
            router.pathname === link.href
              ? `${styles.item} ${styles.item_active}`
              : styles.item
          }
        >
          {link.icon}
          <span className={styles.itemTitle}>{link.title}</span>
        </Link>
      ))}
    </div>
  );
};
