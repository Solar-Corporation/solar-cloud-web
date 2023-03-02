import { ExportOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useAppDispatch } from '../../../../hooks/redux';
import { setIsFilesContextMenuOpen } from '../../../../store/reducers/CloudSlice';
import { setIsModalOpen } from '../../../../store/reducers/ModalSlice';
import { Control, ControlTypeProps } from '../index';

export const ControlMove: FC<ControlTypeProps> = ({ type, block, className }) => {
	const dispatch = useAppDispatch();

	const handleClick = () => {
		dispatch(setIsFilesContextMenuOpen(false));
		dispatch(setIsModalOpen({ moveFile: true }));
	};

	return (
		<Control
			icon={<ExportOutlined />}
			title="Переместить"
			onClick={handleClick}
			className={className}
			type={type}
			block={block}
		/>
	);
};