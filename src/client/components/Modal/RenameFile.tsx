import { Input } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { useCloudReducer } from '../../hooks/cloud';
import { useAppSelector } from '../../hooks/redux';
import { filesAPI } from '../../services/FilesService';
import { setIsModalOpen } from '../../store/reducers/ModalSlice';
import { AppModal } from './index';

export const ModalRenameFile: FC = () => {
	const inputRef = useRef(null);
	const [name, setName] = useState('');
	const { selected, dispatch } = useCloudReducer();
	const { renameFile: isOpen } = useAppSelector(state => state.modalReducer.modal);
	const [renameFile, { isLoading, reset }] = filesAPI.useRenameFileMutation();

	const handleSubmit = async () => {
		if (name !== selected[0].name) {
			const rename = { path: selected[0].path, new_name: name, isDir: selected[0].isDir };
			await renameFile(rename);
		} else {
			handleClose();
		}
	};

	const handleClose = () => {
		dispatch(setIsModalOpen({ renameFile: false }));
	};

	const handleCancel = () => {
		if (isLoading) {
			reset();
		} else {
			handleClose();
		}
	};

	const handleUpdate = () => {
		if (selected.length) {
			if (!isLoading) setName(selected[0].name);
		}
	};

	useEffect(() => {
		handleUpdate();
	}, [selected, isLoading]);

	useEffect(() => {
		if (isOpen) {
			setTimeout(() => {
				// @ts-ignore
				inputRef.current.select();
			}, 200);
		}
	}, [isOpen]);

	return (
		<AppModal
			title={selected.length && selected[0].isDir ? 'Переименовать папку' : 'Переименовать файл'}
			okText="Переименовать"
			open={isOpen}
			confirmLoading={isLoading}
			confirmDisabled={!name}
			onOk={handleSubmit}
			onCancel={handleCancel}
			onClose={handleClose}
			afterClose={handleUpdate}
		>
			<Input
				ref={inputRef}
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