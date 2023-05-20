import { StarFilled, StarOutlined } from '@ant-design/icons';
import { FC, useEffect, useState } from 'react';
import { useCloudReducer } from '../../../../hooks/cloud';
import { filesAPI } from '../../../../services/FilesService';
import { Control, ControlTypeProps } from '../index';

export const ControlMark: FC<ControlTypeProps> = ({ type, block, className }) => {
	const [isMarked, setIsMarked] = useState(false);
	const { selected, marked } = useCloudReducer();
	const [markFile, { isLoading: isLoadingMark }] = filesAPI.useMarkFileMutation();
	const [unmarkFile, { isLoading: isLoadingUnmark }] = filesAPI.useUnmarkFileMutation();

	const handleClick = async () => {
		const hashes = selected.map(file => file.hash);

		if (isMarked) {
			await unmarkFile({ hashes });
		} else {
			await markFile({ hashes });
		}
	};

	useEffect(() => {
		if (selected.length) {
			setIsMarked(!!marked.find(hash => hash === selected[0].hash));
		}
	}, [selected, marked]);

	return (
		<Control
			icon={isMarked ? <StarFilled /> : <StarOutlined />}
			title={isMarked ? 'Убрать из избранного' : 'Пометить как избранное'}
			onClick={handleClick}
			className={className}
			loading={isLoadingMark || isLoadingUnmark}
			type={type}
			block={block}
		/>
	);
};