import { FC } from 'react';
import { IFile } from '../../models/IFile';
import styles from '../../styles/components/FileTable.module.less';

interface FileTableHeaderProps {
	columns: IFile;
}

export const FileTableHeader: FC<FileTableHeaderProps> = ({ columns }) => {
	return (
		<div className={styles.header}>
			<div className={styles.headerName}>Название</div>
			{columns.hasOwnProperty('fileType') && <div className={styles.extension}>Тип</div>}
			{columns.hasOwnProperty('seeTime') && <div className={styles.date}>Дата изменения</div>}
			{columns.hasOwnProperty('size') && <div className={styles.size}>Размер</div>}
		</div>
	);
};