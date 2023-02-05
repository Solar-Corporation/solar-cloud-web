import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';
import { EditOutlined } from '@ant-design/icons';

export const ControlRename: FC<ControlTypeProps> = ({ context, primary }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<EditOutlined />}
			title="Переименовать"
			onClick={handleClick}
			primary={primary}
			context={context}
		/>
	);
};