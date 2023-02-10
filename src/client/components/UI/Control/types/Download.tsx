import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';
import { DownloadOutlined } from '@ant-design/icons';

export const ControlDownload: FC<ControlTypeProps> = ({ type, block, className }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<DownloadOutlined />}
			title="Скачать"
			onClick={handleClick}
			className={className}
			type={type}
			block={block}
		/>
	);
};