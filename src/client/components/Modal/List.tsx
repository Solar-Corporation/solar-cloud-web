import { FC } from 'react';
import { ModalAcceptUser } from './AcceptUser';
import { ModalClearTrash } from './ClearTrash';
import { ModalCopyFile } from './CopyFile';
import { ModalCreateDirectory } from './CreateDirectory';
import { ModalDeclineUser } from './DeclineUser';
import { ModalDeleteFile } from './DeleteFile';
import { ModalDeleteUser } from './DeleteUser';
import { ModalMoveFile } from './MoveFile';
import { ModalRenameFile } from './RenameFile';

export const ModalList: FC = () => {
	return (
		<>
			<ModalAcceptUser />
			<ModalCreateDirectory />
			<ModalRenameFile />
			<ModalMoveFile />
			<ModalCopyFile />
			<ModalDeclineUser />
			<ModalDeleteFile />
			<ModalDeleteUser />
			<ModalClearTrash />
		</>
	);
};