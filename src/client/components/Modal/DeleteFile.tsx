import { FC, useEffect, useState } from 'react';
import { useCloudReducer } from '../../hooks/cloud';
import { useAppSelector } from '../../hooks/redux';
import { filesAPI } from '../../services/FilesService';
import { setIsModalOpen } from '../../store/reducers/ModalSlice';
import { getIsDir } from '../../utils';
import { AppModal } from './index';

export const ModalDeleteFile: FC = () => {
	const [name, setName] = useState('');
	const [length, setLength] = useState(0);
	const [isDir, setIsDir] = useState(false);
	const { selected, dispatch } = useCloudReducer();
	const { deleteFile: isOpen } = useAppSelector(state => state.modalReducer.modal);
	const [deleteFile, { isLoading }] = filesAPI.useDeleteFileMutation();

	const handleSubmit = async () => {
		const paths = {
			paths: selected.map(file => file.path),
			isDir
		};
		await deleteFile(paths);
	};

	const handleClose = () => {
		dispatch(setIsModalOpen({ deleteFile: false }));
	};

	useEffect(() => {
		if (selected.length) {
			if (!isLoading) {
				setLength(selected.length);
				setName(selected[0].name);
				setIsDir(getIsDir(selected));
			}
		}
	}, [selected, isLoading]);

	return (
		<AppModal
			title={
				length > 1
					? isDir ? 'Удалить папки' : 'Удалить файлы'
					: isDir ? 'Удалить папку' : 'Удалить файл'
			}
			okText="Удалить"
			open={isOpen}
			confirmLoading={isLoading}
			onOk={handleSubmit}
			onCancel={handleClose}
		>
			<p>Вы уверены что хотите переместить {
				length > 1
					? isDir ? `папки (${length})` : `файлы (${length})`
					: isDir ? `папку "${name}"` : `файл "${name}"`
			} в корзину?</p>
		</AppModal>
	);
};