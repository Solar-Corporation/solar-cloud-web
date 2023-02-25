import { EditOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useAppDispatch } from '../../../../hooks/redux';
import { setIsFilesContextMenuOpen } from '../../../../store/reducers/CloudSlice';
import { setIsModalOpen } from '../../../../store/reducers/ModalSlice';
import { Control, ControlTypeProps } from '../index';

export const ControlRename: FC<ControlTypeProps> = ({ type, block, className }) => {
	const dispatch = useAppDispatch();

	const handleClick = () => {
		dispatch(setIsFilesContextMenuOpen(false));
		dispatch(setIsModalOpen({ renameFile: true }));
	};

	return (
		<Control
			icon={<EditOutlined />}
			title="Переименовать"
			onClick={handleClick}
			className={className}
			type={type}
			block={block}
		/>
	);
};