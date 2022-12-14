import { PlusOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { Action } from '../index';

export const ActionCreate: FC = () => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Action
			icon={<PlusOutlined />}
			title="Создать"
			onClick={handleClick}
		/>
	);
};