import { DeleteOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useAppDispatch } from '../../../../hooks/redux';
import { setIsFilesContextMenuOpen } from '../../../../store/reducers/CloudSlice';
import { setIsModalOpen } from '../../../../store/reducers/ModalSlice';
import { Control, ControlTypeProps } from '../index';

export const ControlDelete: FC<ControlTypeProps> = ({ type, block, className }) => {
	const dispatch = useAppDispatch();

	const handleClick = () => {
		dispatch(setIsFilesContextMenuOpen(false));
		dispatch(setIsModalOpen({ deleteFile: true }));
	};

	return (
		<Control
			icon={<DeleteOutlined />}
			title="Удалить"
			onClick={handleClick}
			className={className}
			type={type}
			block={block}
		/>
	);
};