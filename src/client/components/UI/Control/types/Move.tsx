import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';
import { ExportOutlined } from '@ant-design/icons';

export const ControlMove: FC<ControlTypeProps> = ({ type, block, className }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<ExportOutlined />}
			title="Переместить"
			onClick={handleClick}
			className={className}
			type={type}
			block={block}
		/>
	);
};