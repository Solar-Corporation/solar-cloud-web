import Link from 'next/link';
import { CSSProperties, FC } from 'react';
import styles from '../../styles/components/Breadcrumbs.module.less';

export interface IBreadcrumbsItem {
	title: string;
	href: string;
}

interface BreadcrumbsItemProps {
	link: IBreadcrumbsItem;
	style?: CSSProperties;
	active?: boolean;
}

export const BreadcrumbsItem: FC<BreadcrumbsItemProps> = ({ link, style, active }) => {
	return (
		<Link
			href={link.href}
			title={link.title}
			style={style}
			className={active ? `${styles.item} ${styles.item_active}` : styles.item}
		>
			{link.title}
		</Link>
	);
};