import Link from 'next/link';
import { FC } from 'react';
import { useAppSelector } from '../../hooks/redux';
import styles from '../../styles/components/Breadcrumbs.module.less';

interface BreadcrumbsItemProps {
	link: {
		title: string;
		href: string;
	};
	active?: boolean;
}

export const BreadcrumbsItem: FC<BreadcrumbsItemProps> = ({ link, active }) => {
	const { url } = useAppSelector(state => state.cloudReducer.context);

	return (
		<Link
			href={link.href}
			title={link.title}
			className={
				active
					? `${styles.item} ${styles.item_active}`
					: url === link.href ? `${styles.item} ${styles.item_active}` : styles.item
			}
		>
			{link.title}
		</Link>
	);
};