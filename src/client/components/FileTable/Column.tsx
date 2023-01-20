import { FC, ReactNode } from 'react';
import styles from '../../styles/components/FileTable.module.less';

interface FileTableColumnProps {
	title?: string;
	className?: string;
	children: ReactNode;
}

export const FileTableColumn: FC<FileTableColumnProps> = ({ title, className, children }) => {
	return (
		<div
			className={className ? `${styles.column} ${className}` : styles.column}
			title={title}
		>
			{children}
		</div>
	);
};