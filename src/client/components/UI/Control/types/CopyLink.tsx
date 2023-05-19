import { CopyOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useCloudReducer } from '../../../../hooks/cloud';
import { setIsFilesContextMenuOpen } from '../../../../store/reducers/CloudSlice';
import { Control, ControlTypeProps } from '../index';

export const ControlCopyLink: FC<ControlTypeProps> = (props) => {
	const { selected, dispatch } = useCloudReducer();

	const handleClick = () => {
		dispatch(setIsFilesContextMenuOpen(false));
	};

	return (
		<Control
			{...props}
			icon={<CopyOutlined />}
			title="Скопировать ссылку"
			onClick={handleClick}
			disablePropagation
		/>
	);
};