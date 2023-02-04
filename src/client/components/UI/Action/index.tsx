import { Button } from 'antd';
import { FC, ReactNode } from 'react';

interface ActionProps {
	icon: ReactNode;
	title: string;
	onClick: () => void;
	children?: never;
}

export const Action: FC<ActionProps> = ({ icon, title, onClick }) => {
	const handleClick = (event: any) => {
		event.stopPropagation();
		onClick();
	};

	return (
		<Button
			title={title}
			type="primary"
			icon={icon}
			onClick={event => handleClick(event)}
		/>
	);
};