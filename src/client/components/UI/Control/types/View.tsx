import { TableOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { ControlType } from '../Type';

export const ControlView: FC = () => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<ControlType
			icon={<TableOutlined />}
			title="Вид"
			onClick={handleClick}
		/>
	);
};