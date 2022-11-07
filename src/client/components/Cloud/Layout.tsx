import {
  DeleteOutlined,
  FileOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { FC, ReactNode } from 'react';
import styles from '../../styles/components/CloudLayout.module.css';
import { Layout } from '../Layout';
import { INavbarItem, Navbar } from '../Navbar';
import { ButtonUpload } from '../UI/ButtonUpload';
import { CloudInfoSpace } from './InfoSpace';

interface CloudLayoutProps {
  title: string;
  children: ReactNode;
}

export const CloudLayout: FC<CloudLayoutProps> = ({ title, children }) => {
  const links: INavbarItem[] = [
    { icon: <HistoryOutlined />, title: 'Недавние', href: '/cloud/recent' },
    { icon: <FileOutlined />, title: 'Все файлы', href: '/cloud' },
    { icon: <DeleteOutlined />, title: 'Корзина', href: '/cloud/trash' },
  ];

  return (
    <Layout
      title={title}
      sidebarTop={
        <div className={styles.sidebar}>
          <ButtonUpload />
          <Navbar links={links} />
        </div>
      }
      sidebarBottom={<CloudInfoSpace />}
    >
      {children}
    </Layout>
  );
};
