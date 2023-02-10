import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';
import { EditOutlined } from '@ant-design/icons';

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