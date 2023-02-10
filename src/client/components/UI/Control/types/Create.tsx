import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';
import { PlusOutlined } from '@ant-design/icons';

export const ControlCreate: FC<ControlTypeProps> = ({ type, block, className }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<PlusOutlined />}
			title="Создать папку"
			onClick={handleClick}
			className={className}
			type={type}
			block={block}
		/>
	);
};