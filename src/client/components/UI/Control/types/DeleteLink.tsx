import { StopOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useCloudReducer } from '../../../../hooks/cloud';
import { setIsFilesContextMenuOpen, unshareFile } from '../../../../store/reducers/CloudSlice';
import { Control, ControlTypeProps } from '../index';

export const ControlDeleteLink: FC<ControlTypeProps> = (props) => {
	const { selected, dispatch } = useCloudReducer();

	const handleClick = () => {
		dispatch(setIsFilesContextMenuOpen(false));
		// subject to change
		dispatch(unshareFile(selected[0].path));
	};

	return (
		<Control
			{...props}
			icon={<StopOutlined />}
			title="Удалить ссылку"
			onClick={handleClick}
			disablePropagation
		/>
	);
};