import { InfoCircleOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';

export const ControlInfo: FC<ControlTypeProps> = ({ type, block, className }) => {
	const handleClick = () => {
		console.log('press');
	};

	return (
		<Control
			icon={<InfoCircleOutlined />}
			title="Сведения"
			onClick={handleClick}
			className={className}
			type={type}
			block={block}
		/>
	);
};