import { CopyOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useAppDispatch } from '../../../../hooks/redux';
import { setIsFilesContextMenuOpen } from '../../../../store/reducers/CloudSlice';
import { setIsModalOpen } from '../../../../store/reducers/ModalSlice';
import { Control, ControlTypeProps } from '../index';

export const ControlCopy: FC<ControlTypeProps> = ({ type, block, className }) => {
	const dispatch = useAppDispatch();

	const handleClick = () => {
		dispatch(setIsFilesContextMenuOpen(false));
		dispatch(setIsModalOpen({ copyFile: true }));
	};


	return (
		<Control
			icon={<CopyOutlined />}
			title="Копировать"
			onClick={handleClick}
			className={className}
			type={type}
			block={block}
		/>
	);
};