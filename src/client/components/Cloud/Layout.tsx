import { DeleteOutlined, FileOutlined, HistoryOutlined, StarOutlined, TagsOutlined } from '@ant-design/icons';
import { FC, ReactNode } from 'react';
import { RouteNames } from '../../router';
import styles from '../../styles/components/CloudLayout.module.less';
import { Layout } from '../Layout';
import { INavbarItem, Navbar } from '../Navbar';
import { PageHeadingProps } from '../PageHeading';
import { ButtonUpload } from '../UI/ButtonUpload';
import { CloudInfoSpace } from './InfoSpace';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { clearSelected } from '../../store/reducers/CloudSlice';
import Control from '../UI/Control/List';

interface CloudLayoutProps {
	title: string;
	headingOptions: PageHeadingProps;
	contextMenu?: Control[];
	children: ReactNode;
}

export const CloudLayout: FC<CloudLayoutProps> = ({ title, headingOptions, contextMenu, children }) => {
	const { selected } = useAppSelector(state => state.cloudReducer);
	const dispatch = useAppDispatch();

	const links: INavbarItem[] = [
		{ icon: <HistoryOutlined />, title: 'Недавние', href: RouteNames.RECENT },
		{ icon: <FileOutlined />, title: 'Все файлы', href: RouteNames.CLOUD },
		{ icon: <StarOutlined />, title: 'Избранное', href: RouteNames.MARKED },
		{ icon: <TagsOutlined />, title: 'Теги', href: RouteNames.TAGS },
		{ icon: <DeleteOutlined />, title: 'Корзина', href: RouteNames.TRASH }
	];

	const handleClearSelected = () => {
		if (selected.length) dispatch(clearSelected());
	};

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
			headingOptions={headingOptions}
			contextMenu={contextMenu}
			onClickContainer={handleClearSelected}
		>
			{children}
		</Layout>
	);
};