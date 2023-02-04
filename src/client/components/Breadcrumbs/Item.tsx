import { FC } from 'react';
import Link from 'next/link';
import styles from '../../styles/components/Breadcrumbs.module.less';
import { useAppSelector } from '../../hooks/redux';

interface BreadcrumbsItemProps {
	link: {
		title: string;
		href: string;
	};
	active?: boolean;
}

export const BreadcrumbsItem: FC<BreadcrumbsItemProps> = ({ link, active }) => {
	const { url } = useAppSelector(state => state.cloudReducer.context);
	console.log(url);

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