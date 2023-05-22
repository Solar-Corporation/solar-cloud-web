import { FC, ReactNode } from 'react';
import { useCloudReducer } from '../../hooks/cloud';
import { IFile } from '../../models/IFile';
import { setIsFilesContextMenuOpen } from '../../store/reducers/CloudSlice';
import styles from '../../styles/components/FileTable.module.less';
import { ContextMenu } from '../ContextMenu';
import { ResultEmpty } from '../Result/Empty';
import { ResultError } from '../Result/Error';
import Control from '../UI/Control/List';
import { FileTableHeader } from './Header';
import { FileTableRow } from './Row';

interface FileTableProps {
	files: IFile[] | null;
	disableHeader?: boolean;
	disableColumns?: boolean;
	showPath?: boolean;
	selected?: IFile[];
	marked?: string[];
	shared?: string[];
	onRowClick?: (event: any, file: IFile, isSelected: boolean) => void;
	onRowContextMenu?: (event: any, file: IFile, isSelected: boolean) => void;
	contextMenu?: Control[];
	className?: string;
	empty?: ReactNode;
}

export const FileTable: FC<FileTableProps> = ({
	                                              files,
	                                              disableHeader,
	                                              disableColumns,
																								showPath,
	                                              selected,
	                                              marked,
																								shared,
	                                              onRowClick,
	                                              onRowContextMenu,
	                                              contextMenu,
	                                              className,
																								empty
                                              }) => {
	const { isFilesContextMenuOpen, dispatch } = useCloudReducer();

	const handleClick = (event: any) => {
		event.stopPropagation();
	};

	const handleOpenChange = (isOpen: boolean) => {
		dispatch(setIsFilesContextMenuOpen(isOpen));
	};

	return (
		files
			? files.length > 0
				? (
					<div className={
						className
							? disableHeader ? `${styles.main} ${styles.disableHeader} ${className}` : `${styles.main} ${className}`
							: disableHeader ? `${styles.main} ${styles.disableHeader}` : styles.main
					}>
						{!disableHeader && <FileTableHeader columns={files[0]} />}
						<ContextMenu
							menu={contextMenu}
							open={isFilesContextMenuOpen}
							onOpenChange={handleOpenChange}
						>
							<div onClick={handleClick} onContextMenu={handleClick}>
								{files.map((file) => (
									<FileTableRow
										key={file.path}
										file={file}
										selected={selected || []}
										marked={marked || []}
										shared={shared || []}
										onClick={onRowClick}
										onContextMenu={onRowContextMenu}
										disableColumns={disableColumns}
										showPath={showPath}
									/>
								))}
							</div>
						</ContextMenu>
					</div>
				) : empty && <>{empty}</> || <ResultEmpty />
			: <ResultError />
	);
};