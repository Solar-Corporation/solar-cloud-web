import { FC } from 'react';
import { IFile } from '../../models/IFile';
import styles from '../../styles/components/FileTable.module.less';
import { FileTableHeader } from './Header';
import { FileTableRow } from './Row';
import Control from '../UI/Control/List';
import { ContextMenu } from '../ContextMenu';

interface FileTableProps {
	files: IFile[];
	disableHeader?: boolean;
	contextMenu?: Control[];
}

export const FileTable: FC<FileTableProps> = ({ files, disableHeader, contextMenu }) => {
	const handleClick = (event: any) => {
		event.stopPropagation();
	};

	return (
		files.length > 0
			?
			<div className={disableHeader ? `${styles.main} ${styles.disableHeader}` : styles.main}>
				{!disableHeader && <FileTableHeader columns={files[0]} />}
				<ContextMenu menu={contextMenu}>
					<div onClick={handleClick} onContextMenu={handleClick}>
						{files.map((file) => <FileTableRow key={file.path} file={file} />)}
					</div>
				</ContextMenu>
			</div>
			: <div>No files yet</div>
	);
};