import { CopyOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';

export const ControlCopy: FC<ControlTypeProps> = ({ type, block, className }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<CopyOutlined />}
			title="Копировать"
			onClick={handleClick}
			className={className}
			type={type}
			block={block}
		/>
	);
};