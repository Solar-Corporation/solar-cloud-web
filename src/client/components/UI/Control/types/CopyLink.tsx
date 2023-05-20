import { CopyOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useCloudReducer } from '../../../../hooks/cloud';
import { filesAPI } from '../../../../services/FilesService';
import { Control, ControlTypeProps } from '../index';

export const ControlCopyLink: FC<ControlTypeProps> = (props) => {
	const { context, selected } = useCloudReducer();
	const [copyLink] = filesAPI.useGetShareLinkMutation();

	const handleClick = async () => {
		await copyLink(selected.length ? selected[0].hash : context.hash || '');
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