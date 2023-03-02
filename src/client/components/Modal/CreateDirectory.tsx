import { Checkbox, Input } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { FC, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { IDirectory } from '../../models/IFile';
import { filesAPI } from '../../services/FilesService';
import { setIsModalOpen } from '../../store/reducers/ModalSlice';
import { AppModal } from './index';

export const ModalCreateDirectory: FC = () => {
	const inputRef = useRef(null);
	const [name, setName] = useState('Новая папка');
	const [relocate, setRelocate] = useState(false);
	const { path } = useAppSelector(state => state.cloudReducer.context);
	const { createDirectory: isOpen } = useAppSelector(state => state.modalReducer.modal);
	const [createDirectory, { isLoading }] = filesAPI.useCreateDirectoryMutation();
	const dispatch = useAppDispatch();

	const handleUpdate = () => {
		if (!isLoading) setName('Новая папка');
	};

	const handleSubmit = async () => {
		const directory: IDirectory = { path, name };
		await createDirectory({ directory, relocate });
	};

	const handleClose = () => {
		dispatch(setIsModalOpen({ createDirectory: false }));
	};

	const handleChange = (event: CheckboxChangeEvent) => {
		setRelocate(event.target.checked);
	};

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
			title="Создать папку"
			okText="Создать"
			open={isOpen}
			confirmLoading={isLoading}
			confirmDisabled={!name}
			afterClose={handleUpdate}
			onOk={handleSubmit}
			onCancel={handleClose}
		>
			<Input
				ref={inputRef}
				name="directoryName"
				placeholder="Введите название папки"
				size="large"
				disabled={isLoading}
				value={name}
				onChange={(event) => setName(event.currentTarget.value)}
			/>
			<Checkbox checked={relocate} disabled={isLoading} onChange={handleChange}>
				Перейти в созданную папку
			</Checkbox>
		</AppModal>
	);
};