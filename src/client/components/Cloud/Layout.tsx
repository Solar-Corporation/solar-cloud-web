import {
	DeleteOutlined,
	FileOutlined,
	HistoryOutlined,
	StarOutlined,
	TagsOutlined,
	TeamOutlined
} from '@ant-design/icons';
import { FC, ReactNode } from 'react';
import { useCloudReducer } from '../../hooks/cloud';
import { IStorageSpace } from '../../models/IFile';
import { RouteNames } from '../../router';
import { clearSelected, clearUserSelected, setIsContextMenuOpen } from '../../store/reducers/CloudSlice';
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
	space: IStorageSpace | null;
	contextMenu?: Control[];
	children: ReactNode;
}

export const CloudLayout: FC<CloudLayoutProps> = ({ title, headingOptions, space, contextMenu, children }) => {
	const { selected, userSelected, isContextMenuOpen, dispatch } = useCloudReducer();

	const links: INavbarItem[] = [
		// { icon: <HistoryOutlined />, title: 'Недавние', href: RouteNames.RECENT },
		{ icon: <FileOutlined />, title: 'Все файлы', href: RouteNames.FILES, additionalHref: RouteNames.DIRECTORY },
		{ icon: <StarOutlined />, title: 'Избранное', href: RouteNames.MARKED },
		{ icon: <TagsOutlined />, title: 'Теги', href: RouteNames.TAGS },
		// { icon: <TeamOutlined />, title: 'Общий доступ', href: RouteNames.SHARED },
		{ icon: <DeleteOutlined />, title: 'Корзина', href: RouteNames.TRASH }
	];

	const handleClearSelected = () => {
		if (selected.length) dispatch(clearSelected());
		if (userSelected.length) dispatch(clearUserSelected());
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
			sidebarBottom={
				<CloudInfoSpace
					percent={space?.percent || 0}
					usageSpace={space?.usageSpace || ''}
					totalSpace={space?.totalSpace || ''}
				/>
			}
			headingOptions={headingOptions}
			contextMenu={contextMenu}
			contextMenuOpen={isContextMenuOpen}
			contextMenuOnOpenChange={handleOpenChange}
			onContainerClick={handleClearSelected}
		>
			{children}
		</Layout>
	);
};