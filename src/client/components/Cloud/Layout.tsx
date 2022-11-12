import { DeleteOutlined, FileOutlined, HistoryOutlined, StarOutlined, TagsOutlined } from '@ant-design/icons';
import { FC, ReactNode } from 'react';
import { RouteNames } from '../../router';
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
		{ icon: <HistoryOutlined />, title: 'Недавние', href: RouteNames.RECENT },
		{ icon: <FileOutlined />, title: 'Все файлы', href: RouteNames.CLOUD },
		{ icon: <StarOutlined />, title: 'Избранное', href: RouteNames.MARKED },
		{ icon: <TagsOutlined />, title: 'Теги', href: RouteNames.TAGS },
		{ icon: <DeleteOutlined />, title: 'Корзина', href: RouteNames.TRASH }
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
			sidebarBottom={<CloudInfoSpace used={2.6} total={15} />}
		>
			{children}
		</Layout>
	);
};
