import { PlusOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { ActionType } from '../Type';

export const ActionCreate: FC = () => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<ActionType
			icon={<PlusOutlined />}
			title='Создать'
			onClick={handleClick}
		/>
	);
};