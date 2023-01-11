import { FC } from 'react';
import { IFile } from '../../models/IFile';
import { FileTableRow } from './Row';

interface FileTableBodyProps {
	files: IFile[];
}

export const FileTableBody: FC<FileTableBodyProps> = ({ files }) => {
	return (
		<tbody>
		{files.map((file) => <FileTableRow file={file} />)}
		</tbody>
	);
};