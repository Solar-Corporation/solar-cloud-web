import { TableOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { Control } from '../index';

export const ControlView: FC = () => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<TableOutlined />}
			title="Вид"
			onClick={handleClick}
		/>
	);
};