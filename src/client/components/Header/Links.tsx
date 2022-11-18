import { Button } from 'antd';
import Link from 'next/link';
import { FC, ReactNode } from 'react';
import styles from '../../styles/components/Header.module.less';

export interface IHeaderLink {
	icon: ReactNode;
	title: string;
	href?: string;
	action?: () => void;
}

interface HeaderLinksProps {
	links: IHeaderLink[];
}

export const HeaderLinks: FC<HeaderLinksProps> = ({ links }) => {
	const handleClick = (action?: () => void) => {
		if (action) {
			action();
		}
	};

	return (
		<div className={styles.links}>
			{links.map((link, index) =>
				link.href ? (
					<Link key={index} href={link.href} className={styles.link}>
						<Button
							type="default"
							shape="circle"
							size="large"
							title={link.title}
							icon={link.icon}
							onClick={() => handleClick(link.action)}
						/>
					</Link>
				) : (
					<Button
						key={index}
						type="default"
						shape="circle"
						size="large"
						title={link.title}
						icon={link.icon}
						onClick={() => handleClick(link.action)}
					/>
				)
			)}
		</div>
	);
};
