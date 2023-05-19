import Head from 'next/head';
import { FC, ReactNode } from 'react';
import styles from '../styles/components/Layout.module.less';
import { ContextMenu } from './ContextMenu';
import { Header } from './Header';
import { PageHeading, PageHeadingProps } from './PageHeading';
import Control from './UI/Control/List';

interface AppLayoutProps {
	title: string;
	sidebarTop?: ReactNode;
	sidebarBottom?: ReactNode;
	headingOptions?: PageHeadingProps;
	contextMenu?: Control[];
	contextMenuOpen?: boolean;
	contextMenuOnOpenChange?: (isOpen: boolean) => void;
	onContainerClick?: () => void;
	children: ReactNode;
}

export const Layout: FC<AppLayoutProps> = ({
	                                           title,
	                                           sidebarTop,
	                                           sidebarBottom,
	                                           headingOptions,
	                                           contextMenu,
	                                           contextMenuOpen,
	                                           contextMenuOnOpenChange,
	                                           onContainerClick,
	                                           children
                                           }) => {
	return (
		<>
			<Head>
				<title>{`${title} | SolarCloud`}</title>
				<meta name="description" content="description" />
				<meta charSet="utf-8" />
			</Head>
			<div onClick={onContainerClick} onContextMenu={onContainerClick}>
				<Header />
				<main className={styles.main}>
					{(sidebarTop || sidebarBottom) && (
						<div className={styles.sidebar}>
							{sidebarTop && <div className={styles.stickyTop}>{sidebarTop}</div>}
							{sidebarBottom && <div className={styles.stickyBottom}>{sidebarBottom}</div>}
						</div>
					)}
					<ContextMenu open={contextMenuOpen} onOpenChange={contextMenuOnOpenChange} menu={contextMenu}>
						<div style={!(sidebarTop || sidebarBottom) ? {width: '100%'} : undefined} className={styles.container}>
							{headingOptions && <PageHeading {...headingOptions}/>}
							<div className={styles.content}>{children}</div>
						</div>
					</ContextMenu>
				</main>
			</div>
		</>
	);
};