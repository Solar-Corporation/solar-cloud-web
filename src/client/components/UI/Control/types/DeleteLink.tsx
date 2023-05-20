import { StopOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useCloudReducer } from '../../../../hooks/cloud';
import { filesAPI } from '../../../../services/FilesService';
import { Control, ControlTypeProps } from '../index';

export const ControlDeleteLink: FC<ControlTypeProps> = (props) => {
	const { context, selected } = useCloudReducer();
	const [deleteLink] = filesAPI.useDeleteShareLinkMutation();

	const handleClick = async () => {
		await deleteLink(selected.length ? selected[0].hash : context.hash || '');
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