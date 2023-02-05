import { FC, ReactNode } from 'react';
import styles from '../../styles/components/ContextMenu.module.less';

interface ContextMenuItemProps {
	icon: ReactNode;
	title: string;
	className?: string;
	onClick?: (event: any) => void;
	children?: never;
}

export const ContextMenuItem: FC<ContextMenuItemProps> = ({ icon, title, className, onClick }) => {
	return (
		<div
			className={className ? `${styles.item} ${className}` : styles.item}
			onClick={onClick}
		>
			{icon}
			<span className={styles.itemTitle}>{title}</span>
		</div>
	);
};