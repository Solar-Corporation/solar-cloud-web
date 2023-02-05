import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';
import { ExportOutlined } from '@ant-design/icons';

export const ControlMove: FC<ControlTypeProps> = ({ context, primary }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<ExportOutlined />}
			title="Переместить"
			onClick={handleClick}
			primary={primary}
			context={context}
		/>
	);
};