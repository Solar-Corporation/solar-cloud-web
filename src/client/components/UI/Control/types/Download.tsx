import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';
import { DownloadOutlined } from '@ant-design/icons';

export const ControlDownload: FC<ControlTypeProps> = ({ context, primary }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<DownloadOutlined />}
			title="Скачать"
			onClick={handleClick}
			primary={primary}
			context={context}
		/>
	);
};