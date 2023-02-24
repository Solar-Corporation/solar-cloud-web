import {
	DeleteOutlined,
	FileOutlined,
	HistoryOutlined,
	StarOutlined,
	TagsOutlined,
	TeamOutlined
} from '@ant-design/icons';
import { FC, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { RouteNames } from '../../router';
import { clearSelected, setIsContextMenuOpen } from '../../store/reducers/CloudSlice';
import styles from '../../styles/components/CloudLayout.module.less';
import { Layout } from '../Layout';
import { INavbarItem, Navbar } from '../Navbar';
import { PageHeadingProps } from '../PageHeading';
import { ButtonUpload } from '../UI/ButtonUpload';
import Control from '../UI/Control/List';
import { CloudInfoSpace } from './InfoSpace';

interface CloudLayoutProps {
	title: string;
	headingOptions: PageHeadingProps;
	contextMenu?: Control[];
	children: ReactNode;
}

export const CloudLayout: FC<CloudLayoutProps> = ({ title, headingOptions, contextMenu, children }) => {
	const { selected, isContextMenuOpen } = useAppSelector(state => state.cloudReducer);
	const dispatch = useAppDispatch();

	const links: INavbarItem[] = [
		{ icon: <HistoryOutlined />, title: 'Недавние', href: RouteNames.RECENT },
		{ icon: <FileOutlined />, title: 'Все файлы', href: RouteNames.CLOUD },
		{ icon: <StarOutlined />, title: 'Избранное', href: RouteNames.MARKED },
		{ icon: <TagsOutlined />, title: 'Теги', href: RouteNames.TAGS },
		{ icon: <TeamOutlined />, title: 'Общий доступ', href: RouteNames.SHARED },
		{ icon: <DeleteOutlined />, title: 'Корзина', href: RouteNames.TRASH }
	];

	const handleClearSelected = () => {
		if (selected.length) dispatch(clearSelected());
	};

	const handleOpenChange = (isOpen: boolean) => {
		dispatch(setIsContextMenuOpen(isOpen));
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
			contextMenuOpen={isContextMenuOpen}
			contextMenuOnOpenChange={handleOpenChange}
			onClickContainer={handleClearSelected}
		>
			{children}
		</Layout>
	);
};