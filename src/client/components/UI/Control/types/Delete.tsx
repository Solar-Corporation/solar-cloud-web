import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';
import { DeleteOutlined } from '@ant-design/icons';

export const ControlDelete: FC<ControlTypeProps> = ({ context, primary }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<DeleteOutlined />}
			title="Удалить"
			onClick={handleClick}
			primary={primary}
			context={context}
		/>
	);
};