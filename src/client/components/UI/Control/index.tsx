import { Button, Tooltip } from 'antd';
import { FC, ReactNode } from 'react';
import { tooltipShowDelay } from '../../../utils';

interface ControlTypeProps {
	icon: ReactNode;
	title: string;
	onClick: () => void;
	children?: never;
}

export const Control: FC<ControlTypeProps> = ({ icon, title, onClick }) => {
	return (
		<Tooltip
			title={title}
			placement="bottom"
			mouseEnterDelay={tooltipShowDelay}
		>
			<Button
				type="ghost"
				icon={icon}
				onClick={onClick}
			/>
		</Tooltip>
	);
};