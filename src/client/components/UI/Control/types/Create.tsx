import { PlusOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useAppDispatch } from '../../../../hooks/redux';
import { setIsContextMenuOpen } from '../../../../store/reducers/CloudSlice';
import { setIsModalOpen } from '../../../../store/reducers/ModalSlice';
import { Control, ControlTypeProps } from '../index';

export const ControlCreate: FC<ControlTypeProps> = ({ type, block, className }) => {
	const dispatch = useAppDispatch();

	const handleClick = () => {
		dispatch(setIsContextMenuOpen(false));
		dispatch(setIsModalOpen({ createDirectory: true }));
	};

	return (
		<Control
			icon={<PlusOutlined />}
			title="Создать папку"
			onClick={handleClick}
			className={className}
			type={type}
			block={block}
		/>
	);
};