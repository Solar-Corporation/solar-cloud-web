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
		const paths = { paths: selected.map(file => file.path) };

		if (isMarked) {
			await unmarkFile(paths);
		} else {
			await markFile(paths);
		}
	};

	useEffect(() => {
		if (selected.length) setIsMarked(!!marked.find(path => path === selected[0].path));
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