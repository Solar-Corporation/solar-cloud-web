import { EditOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';

export const ControlRename: FC<ControlTypeProps> = ({ type, block, className }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<EditOutlined />}
			title="Переименовать"
			onClick={handleClick}
			className={className}
			type={type}
			block={block}
		/>
	);
};