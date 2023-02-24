import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { IFile } from '../../models/IFile';
import { setIsFilesContextMenuOpen } from '../../store/reducers/CloudSlice';
import styles from '../../styles/components/FileTable.module.less';
import { ContextMenu } from '../ContextMenu';
import Control from '../UI/Control/List';
import { FileTableHeader } from './Header';
import { FileTableRow } from './Row';

interface FileTableProps {
	files: IFile[];
	disableHeader?: boolean;
	contextMenu?: Control[];
}

export const FileTable: FC<FileTableProps> = ({ files, disableHeader, contextMenu }) => {
	const { isFilesContextMenuOpen } = useAppSelector(state => state.cloudReducer);
	const dispatch = useAppDispatch();

	const handleClick = (event: any) => {
		event.stopPropagation();
	};

	const handleOpenChange = (isOpen: boolean) => {
		dispatch(setIsFilesContextMenuOpen(isOpen));
	};

	return (
		files.length > 0
			?
			<div className={disableHeader ? `${styles.main} ${styles.disableHeader}` : styles.main}>
				{!disableHeader && <FileTableHeader columns={files[0]} />}
				<ContextMenu
					menu={contextMenu}
					open={isFilesContextMenuOpen}
					onOpenChange={handleOpenChange}
				>
					<div onClick={handleClick} onContextMenu={handleClick}>
						{files.map((file) => <FileTableRow key={file.path} file={file} />)}
					</div>
				</ContextMenu>
			</div>
			: <div>No files yet</div>
	);
};