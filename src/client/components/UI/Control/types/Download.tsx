import { DownloadOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useCloudReducer } from '../../../../hooks/cloud';
import { filesAPI } from '../../../../services/FilesService';
import { Control, ControlTypeProps } from '../index';

export const ControlDownload: FC<ControlTypeProps> = ({ type, block, className }) => {
	const { context, selected, directoryName } = useCloudReducer();
	const [downloadFile, { isLoading }] = filesAPI.useDownloadFileMutation();

	const handleClick = async () => {
		if (selected.length) {
			for (const file of selected) {
				const download = { name: file.name, hash: file.hash };
				await downloadFile(download);
			}
		} else {
			const download = { name: directoryName, hash: context.hash || '' };
			await downloadFile(download);
		}
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