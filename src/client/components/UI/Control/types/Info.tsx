import { InfoCircleOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';

export const ControlInfo: FC<ControlTypeProps> = ({ context }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<InfoCircleOutlined />}
			title="Свойства"
			onClick={handleClick}
			context={context}
		/>
	);
};