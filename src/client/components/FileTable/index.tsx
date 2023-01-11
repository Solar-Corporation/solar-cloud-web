import { FC } from 'react';
import { IFile } from '../../models/IFile';
import { FileTableBody } from './Body';
import { FileTableHeader } from './Header';
import styles from '../../styles/components/FileTable.module.less';

interface FileTableProps {
	files: IFile[];
	disableHeader?: boolean;
}

export const FileTable: FC<FileTableProps> = ({ files, disableHeader }) => {
	return (
		files.length > 0
			? <table className={styles.main}>
				{!disableHeader && <FileTableHeader columns={files[0]} />}
				<FileTableBody files={files} />
			</table>
			: <div>No files yet</div>
	);
};