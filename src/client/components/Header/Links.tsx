import { Button, Tooltip } from 'antd';
import Link from 'next/link';
import { FC, ReactNode } from 'react';
import styles from '../../styles/components/Header.module.less';
import { tooltipShowDelay } from '../../utils';

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
						<Tooltip
							title={link.title}
							mouseEnterDelay={tooltipShowDelay}
						>
							<Button
								type="default"
								shape="circle"
								size="large"
								icon={link.icon}
								onClick={() => handleClick(link.action)}
							/>
						</Tooltip>
					</Link>
				) : (
					<Tooltip
						key={index}
						title={link.title}
						mouseEnterDelay={tooltipShowDelay}
					>
						<Button
							type="default"
							shape="circle"
							size="large"
							icon={link.icon}
							onClick={() => handleClick(link.action)}
						/>
					</Tooltip>
				)
			)}
		</div>
	);
};