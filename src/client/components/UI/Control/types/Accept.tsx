import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useAppDispatch } from '../../../../hooks/redux';
import { setIsFilesContextMenuOpen } from '../../../../store/reducers/CloudSlice';
import { setIsModalOpen } from '../../../../store/reducers/ModalSlice';
import { Control, ControlTypeProps } from '../index';

interface ControlAcceptProps extends ControlTypeProps {
	decline?: boolean;
}

export const ControlAccept: FC<ControlAcceptProps> = ({type, block, className, decline}) => {
	const dispatch = useAppDispatch();

	const handleClick = () => {
		dispatch(setIsFilesContextMenuOpen(false));
		if (!decline) {
			dispatch(setIsModalOpen({ acceptUser: true }));
		} else {
			dispatch(setIsModalOpen({ declineUser: true }))
		}
	};

	return (
		<Control
			icon={decline ? <StopOutlined /> : <CheckCircleOutlined />}
			title={decline ? 'Отклонить' : 'Принять'}
			onClick={handleClick}
			className={className}
			type={type}
			block={block}
		/>
	);
};