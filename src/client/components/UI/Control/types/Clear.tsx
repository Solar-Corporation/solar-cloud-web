import { DeleteFilled } from '@ant-design/icons';
import { FC } from 'react';
import { useCloudReducer } from '../../../../hooks/cloud';
import { useAppDispatch } from '../../../../hooks/redux';
import { setIsFilesContextMenuOpen } from '../../../../store/reducers/CloudSlice';
import { setIsModalOpen } from '../../../../store/reducers/ModalSlice';
import { Control, ControlTypeProps } from '../index';

interface ControlClearProps extends ControlTypeProps{
	file?: boolean;
}

export const ControlClear: FC<ControlClearProps> = ({ type, block, className, file }) => {
	const { current, dispatch } = useCloudReducer();

	const handleClick = () => {
		dispatch(setIsFilesContextMenuOpen(false));
		dispatch(setIsModalOpen({ clearTrash: true }));
	};

	return (
		<Control
			icon={<DeleteFilled />}
			title={file ? 'Удалить навсегда' : 'Очистить корзину'}
			onClick={handleClick}
			className={className}
			disabled={file ? false : !current?.length}
			type={type}
			block={block}
		/>
	);
};