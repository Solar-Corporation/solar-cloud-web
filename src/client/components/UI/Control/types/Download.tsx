import { DownloadOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useCloudReducer } from '../../../../hooks/cloud';
import { filesAPI } from '../../../../services/FilesService';
import { Control, ControlTypeProps } from '../index';

export const ControlDownload: FC<ControlTypeProps> = ({ type, block, className }) => {
	const { selected } = useCloudReducer();
	const [downloadFile, { isLoading }] = filesAPI.useDownloadFileMutation();

	const handleClick = () => {
		selected.forEach(async (file) => {
			const download = { name: file.name, path: file.path };
			await downloadFile(download);
		});
	};

	return (
		<Control
			icon={<DownloadOutlined />}
			title="Скачать"
			onClick={handleClick}
			className={className}
			loading={isLoading}
			type={type}
			block={block}
		/>
	);
};