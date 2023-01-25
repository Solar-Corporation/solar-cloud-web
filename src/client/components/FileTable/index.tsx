import { FC } from 'react';
import { IFile } from '../../models/IFile';
import styles from '../../styles/components/FileTable.module.less';
import { FileTableHeader } from './Header';
import { FileTableRow } from './Row';

interface FileTableProps {
	files: IFile[];
	disableHeader?: boolean;
}

export const FileTable: FC<FileTableProps> = ({ files, disableHeader }) => {
	return (
		files.length > 0
			? <div className={styles.main}>
				{!disableHeader && <FileTableHeader columns={files[0]} />}
				{files.map((file) => <FileTableRow key={file.path} file={file} />)}
			</div>
			: <div>No files yet</div>
	);
};