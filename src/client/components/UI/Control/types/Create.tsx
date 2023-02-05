import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';
import { PlusOutlined } from '@ant-design/icons';

export const ControlCreate: FC<ControlTypeProps> = ({ context, primary }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<PlusOutlined />}
			title="Создать"
			onClick={handleClick}
			primary={primary}
			context={context}
		/>
	);
};