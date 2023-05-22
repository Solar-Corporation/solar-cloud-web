import { DownloadOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useCloudReducer } from '../../../../hooks/cloud';
import { filesAPI } from '../../../../services/FilesService';
import { Control, ControlTypeProps } from '../index';

export const ControlDownload: FC<ControlTypeProps> = ({ type, block, className }) => {
	const { context, selected } = useCloudReducer();
	const [downloadFile] = filesAPI.useDownloadFileMutation();
	const handleClick = async () => {
		if (selected.length) {
			for (const file of selected) {
				await downloadFile(file.hash);
			}
		} else {
			await downloadFile(context.hash || '');
		}
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