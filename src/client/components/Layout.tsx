import Head from 'next/head';
import { FC, ReactNode } from 'react';
import styles from '../styles/components/Layout.module.less';
import { Header } from './Header';
import { PageHeading, PageHeadingProps } from './PageHeading';
import Control from './UI/Control/List';
import { ContextMenu } from './ContextMenu';

interface AppLayoutProps {
	title: string;
	sidebarTop?: ReactNode;
	sidebarBottom?: ReactNode;
	headingOptions?: PageHeadingProps;
	contextMenu?: Control[];
	onClickContainer?: () => void;
	children: ReactNode;
}

export const Layout: FC<AppLayoutProps> = ({
																						 title,
																						 sidebarTop,
																						 sidebarBottom,
																						 headingOptions,
																						 contextMenu,
																						 onClickContainer,
																						 children
																					 }) => {
	return (
		<>
			<Head>
				<title>{`${title} | SolarCloud`}</title>
				<meta name="description" content="description" />
				<meta charSet="utf-8" />
			</Head>
			<div onClick={onClickContainer} onContextMenu={onClickContainer}>
				<Header />
				<main className={styles.main}>
					{
						(sidebarTop || sidebarBottom) &&
            <div className={styles.sidebar}>
							{sidebarTop && <div className={styles.stickyTop}>{sidebarTop}</div>}
							{sidebarBottom && <div className={styles.stickyBottom}>{sidebarBottom}</div>}
            </div>
					}
					<ContextMenu menu={contextMenu}>
						<div className={styles.container}>
							{
								headingOptions &&
                <PageHeading
                  links={headingOptions.links}
                  actions={headingOptions.actions}
                  floatControls={headingOptions.floatControls}
                  constControls={headingOptions.constControls}
                  sticky={headingOptions.sticky}
                />
							}
							<div className={styles.content}>
								{children}
							</div>
						</div>
					</ContextMenu>
				</main>
			</div>
		</>
	);
};