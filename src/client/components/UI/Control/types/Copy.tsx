import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';
import { CopyOutlined } from '@ant-design/icons';

export const ControlCopy: FC<ControlTypeProps> = ({ context }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<CopyOutlined />}
			title="Копировать"
			onClick={handleClick}
			context={context}
		/>
	);
};