import { TableOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';

export const ControlView: FC<ControlTypeProps> = ({ context }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<TableOutlined />}
			title="Вид"
			onClick={handleClick}
			context={context}
		/>
	);
};