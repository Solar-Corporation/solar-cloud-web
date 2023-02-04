import { StarOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';

export const ControlMark: FC<ControlTypeProps> = ({ context }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<StarOutlined />}
			title="Добавить в избранное"
			onClick={handleClick}
			context={context}
		/>
	);
};