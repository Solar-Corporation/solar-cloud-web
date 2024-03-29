import {
	DeleteOutlined,
	FileOutlined,
	HistoryOutlined,
	StarOutlined,
	TagsOutlined,
	TeamOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import { FC, ReactNode, useEffect } from 'react';
import { useCloudReducer } from '../../hooks/cloud';
import { useAppSelector } from '../../hooks/redux';
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
	const { accessToken: token } = useAppSelector(state => state.userReducer);
	const { selected, userSelected, isContextMenuOpen, dispatch } = useCloudReducer();
	const router = useRouter();

	const links: INavbarItem[] = [
		// { icon: <HistoryOutlined />, title: 'Недавние', href: RouteNames.RECENT },
		{ icon: <FileOutlined />, title: 'Все файлы', href: RouteNames.FILES, additionalHref: RouteNames.DIRECTORY },
		{ icon: <StarOutlined />, title: 'Избранное', href: RouteNames.MARKED },
		// { icon: <TagsOutlined />, title: 'Теги', href: RouteNames.TAGS },
		// { icon: <TeamOutlined />, title: 'Общий доступ', href: RouteNames.SHARED },
		{ icon: <DeleteOutlined />, title: 'Корзина', href: RouteNames.TRASH }
	];

	useEffect(() => {
		if (!token) {
			if (router.pathname === RouteNames.FILES || router.pathname === RouteNames.DIRECTORY) {
				router.push(RouteNames.LOGIN);
			} else {
				router.push(`${RouteNames.LOGIN}?return_to=${router.pathname}`);
			}
			destroyCookie(null, 'accessToken');
			destroyCookie(null, 'refreshToken');
		}
	}, [token]);

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