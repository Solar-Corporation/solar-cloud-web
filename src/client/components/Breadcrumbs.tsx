import { RightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';
import styles from '../styles/components/Breadcrumbs.module.css';

export interface IBreadcrumbsItem {
	title: string;
	href: string;
}

interface BreadcrumbsProps {
	links: IBreadcrumbsItem[];
	actions?: ReactNode;
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ links, actions }) => {
	const router = useRouter();

	return (
		<div className={styles.container}>
			{links.map((link, index) =>
				<>
					<Link
						key={index}
						href={link.href}
						className={
							router.pathname === link.href
								? `${styles.item} ${styles.item_active}`
								: styles.item
						}
					>
						{link.title}
					</Link>
					{(index !== links.length - 1) && <RightOutlined className={styles.separator} />}
				</>
			)}
			{actions && <>
        <RightOutlined />
				{actions}
      </>}
		</div>
	);
};