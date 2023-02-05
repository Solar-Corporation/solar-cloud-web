import { Button } from 'antd';
import { FC, ReactNode } from 'react';
import { ContextMenuItem } from '../../ContextMenu/Item';

export interface ControlTypeProps {
	context?: boolean;
	primary?: boolean;
}

interface ControlProps {
	icon: ReactNode;
	title: string;
	onClick?: () => void;
	primary?: boolean;
	context?: boolean;
	children?: never;
}

export const Control: FC<ControlProps> = ({ icon, title, onClick, primary, context }) => {
	const handleClick = (event: any) => {
		event.stopPropagation();
		if (onClick) onClick();
	};

	return (
		context
			?
			<ContextMenuItem
				title={title}
				icon={icon}
				onClick={handleClick}
			/>
			:
			<Button
				title={title}
				icon={icon}
				type={primary ? 'primary' : 'ghost'}
				onClick={handleClick}
			/>
	);
};