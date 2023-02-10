import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';
import { LinkOutlined } from '@ant-design/icons';

export const ControlShare: FC<ControlTypeProps> = ({ type, block, className }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<LinkOutlined />}
			title="Поделиться"
			onClick={handleClick}
			className={className}
			type={type}
			block={block}
		/>
	);
};