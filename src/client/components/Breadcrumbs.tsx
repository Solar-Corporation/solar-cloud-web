import { RightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import styles from '../styles/components/Breadcrumbs.module.less';
import { Action, ActionList } from './UI/Action/List';

export interface IBreadcrumbsItem {
	title: string;
	href: string;
}

interface BreadcrumbsProps {
	links: IBreadcrumbsItem[];
	actions?: Action[];
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ links, actions }) => {
	const router = useRouter();

	return (
		<div className={styles.container}>
			{links.map((link, index) => [
				<Link
					key={index}
					href={link.href}
					title={link.title}
					className={
						router.asPath === link.href
							? `${styles.item} ${styles.item_active}`
							: styles.item
					}
				>
					{link.title}
				</Link>,
				(index !== links.length - 1) && <RightOutlined key={`separator${index}`} className={styles.separator} />
			])}
			{actions && actions.length > 0 && <>
        <RightOutlined className={styles.separator} />
        <ActionList list={actions} />
      </>}
		</div>
	);
};