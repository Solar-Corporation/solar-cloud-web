import { TableOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';

export const ControlView: FC<ControlTypeProps> = ({ type, block, className }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<TableOutlined />}
			title="Вид"
			onClick={handleClick}
			className={className}
			type={type}
			block={block}
		/>
	);
};