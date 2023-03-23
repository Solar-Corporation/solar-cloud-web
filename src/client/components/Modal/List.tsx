import { FC } from 'react';
import { ModalClearTrash } from './ClearTrash';
import { ModalCreateDirectory } from './CreateDirectory';
import { ModalDeleteFile } from './DeleteFile';
import { ModalMoveFile } from './MoveFile';
import { ModalRenameFile } from './RenameFile';

export const ModalList: FC = () => {
	return (
		<>
			<ModalCreateDirectory />
			<ModalRenameFile />
			<ModalMoveFile />
			<ModalDeleteFile />
			<ModalClearTrash />
		</>
	);
};