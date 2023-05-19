import { DeleteOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useAppDispatch } from '../../../../hooks/redux';
import { setIsFilesContextMenuOpen } from '../../../../store/reducers/CloudSlice';
import { setIsModalOpen } from '../../../../store/reducers/ModalSlice';
import { Control, ControlTypeProps } from '../index';

interface ControlDeleteProps extends ControlTypeProps {
	user?: boolean;
}

export const ControlDelete: FC<ControlDeleteProps> = ({ type, block, className, user }) => {
	const dispatch = useAppDispatch();

	const handleClick = () => {
		dispatch(setIsFilesContextMenuOpen(false));
		if (!user) {
			dispatch(setIsModalOpen({ deleteFile: true }));
		} else {
			dispatch(setIsModalOpen({ deleteUser: true }));
		}
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