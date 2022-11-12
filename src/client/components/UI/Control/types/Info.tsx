import { InfoCircleOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { ControlType } from '../Type';

export const ControlInfo: FC = () => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<ControlType
			icon={<InfoCircleOutlined />}
			title="Показать свойства"
			onClick={handleClick}
		/>
	);
};