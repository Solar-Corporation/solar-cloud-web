import { FC } from 'react';
import { IFile } from '../../models/IFile';
import styles from '../../styles/components/FileTable.module.less';

interface FileTableHeaderProps {
	columns: IFile;
}

export const FileTableHeader: FC<FileTableHeaderProps> = ({ columns }) => {
	return (
		<thead>
		<tr>
			{columns.name && <th className={styles.name}>Название</th>}
			{columns.fileType && <th className={styles.extension}>Тип</th>}
			{columns.seeTime && <th className={styles.date}>Дата изменения</th>}
			{columns.size && <th className={styles.size}>Размер</th>}
		</tr>
		</thead>
	);
};