import { Input } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useCloudReducer } from '../../hooks/cloud';
import { useAppSelector } from '../../hooks/redux';
import { filesAPI } from '../../services/FilesService';
import { setIsModalOpen } from '../../store/reducers/ModalSlice';
import { AppModal } from './index';

export const ModalRenameFile: FC = () => {
	const [name, setName] = useState('');
	const { selected, dispatch } = useCloudReducer();
	const { renameFile: isOpen } = useAppSelector(state => state.modalReducer.modal);
	const [renameFile, { isLoading }] = filesAPI.useRenameFileMutation();

	const handleSubmit = async () => {
		const rename = { path: selected[0].path, new_name: name, isDir: selected[0].isDir };
		await renameFile(rename);
	};

	const handleClose = () => {
		dispatch(setIsModalOpen({ renameFile: false }));
	};

	useEffect(() => {
		if (selected.length) {
			if (!isLoading) setName(selected[0].name);
		}
	}, [selected]);

	return (
		<AppModal
			title={selected.length && selected[0].isDir ? 'Переименовать папку' : 'Переименовать файл'}
			okText="Переименовать"
			cancelText="Отменить"
			open={isOpen}
			confirmLoading={isLoading}
			onOk={handleSubmit}
			onCancel={handleClose}
		>
			<Input
				name="newFileName"
				placeholder="Введите новое название файла"
				size="large"
				disabled={isLoading}
				value={name}
				onChange={(event) => setName(event.currentTarget.value)}
			/>
		</AppModal>
	);
};