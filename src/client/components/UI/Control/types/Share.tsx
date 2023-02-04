import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';
import { LinkOutlined } from '@ant-design/icons';

export const ControlShare: FC<ControlTypeProps> = ({ context }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<LinkOutlined />}
			title="Поделиться"
			onClick={handleClick}
			context={context}
		/>
	);
};