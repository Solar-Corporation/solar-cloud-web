import { FC, useEffect, useState } from 'react';
import { useCloudReducer } from '../../hooks/cloud';
import { useAppSelector } from '../../hooks/redux';
import { filesAPI } from '../../services/FilesService';
import { setIsModalOpen } from '../../store/reducers/ModalSlice';
import { getIsDir } from '../../utils';
import { AppModal } from './index';

export const ModalClearTrash: FC = () => {
	const [name, setName] = useState('');
	const [length, setLength] = useState(0);
	const [isDir, setIsDir] = useState(false);
	const { selected, dispatch } = useCloudReducer();
	const { clearTrash: isOpen } = useAppSelector(state => state.modalReducer.modal);
	const [clearTrash, { isLoading, reset }] = filesAPI.useClearTrashMutation();

	const handleSubmit = async () => {
		const paths = {
			paths: selected.map(file => file.path),
			isDir
		};
		await clearTrash('');
	};

	const handleClose = () => {
		dispatch(setIsModalOpen({ clearTrash: false }));
	};

	const handleCancel = () => {
		if (isLoading) {
			reset();
		} else {
			handleClose();
		}
	};

	useEffect(() => {
		if (!isLoading) {
			if (selected.length) {
				setLength(selected.length);
				setName(selected[0].name);
				setIsDir(getIsDir(selected));
			} else {
				setLength(0);
				setName('');
				setIsDir(false);
			}
		}
	}, [selected, isLoading]);

	return (
		<AppModal
			title={
				length
					? length > 1
						? isDir ? 'Удалить папки' : 'Удалить файлы'
						: isDir ? 'Удалить папку' : 'Удалить файл'
					: 'Очистить корзину'
			}
			okText={length ? 'Удалить' : 'Очистить'}
			open={isOpen}
			confirmLoading={isLoading}
			onOk={handleSubmit}
			onCancel={handleCancel}
			onClose={handleClose}
		>
			<p>{
				length
					? <>Вы уверены, что хотите навсегда удалить {
						length > 1
							? isDir ? `папки (${length})` : `файлы (${length})`
							: isDir ? `папку "${name}"` : `файл "${name}"`
					}?</>
					: 'Вы уверены, что хотите очистить корзину?'
			}</p>
		</AppModal>
	);
};