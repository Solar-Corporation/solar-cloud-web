import { InfoCircleOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { Control } from '../index';

export const ControlInfo: FC = () => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<InfoCircleOutlined />}
			title="Показать свойства"
			onClick={handleClick}
		/>
	);
};