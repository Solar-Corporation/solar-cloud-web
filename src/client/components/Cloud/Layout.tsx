import { DeleteOutlined, FileOutlined, HistoryOutlined } from '@ant-design/icons';
import { FC, ReactNode } from 'react';
import styles from '../../styles/components/CloudLayout.module.css';
import { AppLayout } from '../AppLayout';
import { INavbarItem, Navbar } from '../Navbar';
import { ButtonUpload } from '../UI/ButtonUpload';

interface CloudLayoutProps {
  title: string;
  children: ReactNode;
}

export const CloudLayout: FC<CloudLayoutProps> = ({ title, children }) => {
  const links: INavbarItem[] = [
    { icon: <HistoryOutlined />, title: 'Недавние', href: '/cloud/recent' },
    { icon: <FileOutlined />, title: 'Все файлы', href: '/cloud' },
    { icon: <DeleteOutlined />, title: 'Корзина', href: '/cloud/trash' }
  ];

  return (
    <AppLayout
      title={title}
      navbar={
        <div className={styles.navbar}>
          <ButtonUpload />
          <Navbar links={links} />
        </div>
      }
    >
      {children}
    </AppLayout>
  );
};
