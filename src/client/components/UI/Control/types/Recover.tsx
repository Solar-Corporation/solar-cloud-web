import { ReloadOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useCloudReducer } from '../../../../hooks/cloud';
import { filesAPI } from '../../../../services/FilesService';
import { getIsDir } from '../../../../utils';
import { Control, ControlTypeProps } from '../index';

export const ControlRecover: FC<ControlTypeProps> = ({ type, block, className }) => {
	const { selected } = useCloudReducer();
	const [recoverFile, {isLoading}] = filesAPI.useRecoverFileMutation();

	const handleClick = async () => {
		const hashes = selected.map(file => file.hash);
		await recoverFile({ hashes, isDir: getIsDir(selected) });
	};

	return (
		<Control
			icon={<ReloadOutlined />}
			title="Восстановить"
			onClick={handleClick}
			className={className}
			loading={isLoading}
			type={type}
			block={block}
		/>
	);
};