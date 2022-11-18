import { Button, Tooltip } from 'antd';
import { FC, ReactNode } from 'react';
import { tooltipShowDelay } from '../../../utils';

interface ActionTypeProps {
	icon: ReactNode;
	title: string;
	onClick: () => void;
	children?: never;
}

export const Action: FC<ActionTypeProps> = ({ icon, title, onClick }) => {
	return (
		<Tooltip
			title={title}
			placement="bottom"
			mouseEnterDelay={tooltipShowDelay}
		>
			<Button
				type="primary"
				icon={icon}
				onClick={onClick}
			/>
		</Tooltip>
	);
};