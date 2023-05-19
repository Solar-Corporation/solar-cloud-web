import { FC } from 'react';
import styles from '../../styles/components/FileTable.module.less';

export const UserTableHeader: FC = () => {
	return (
		<div className={styles.header}>
			<div className={styles.headerName}>Фамилия Имя Отчество</div>
			<div style={{ minWidth: 400, maxWidth: 400 }}>E-mail</div>
			<div style={{ minWidth: 150, maxWidth: 150 }}>Статус</div>
		</div>
	);
};