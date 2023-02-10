import { StarOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';

export const ControlMark: FC<ControlTypeProps> = ({ type, block, className }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<StarOutlined />}
			title="Пометить как избранное"
			onClick={handleClick}
			className={className}
			type={type}
			block={block}
		/>
	);
};