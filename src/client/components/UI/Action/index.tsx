import { Button } from 'antd';
import { FC, ReactNode } from 'react';

interface ActionTypeProps {
	icon: ReactNode;
	title: string;
	onClick: () => void;
	children?: never;
}

export const Action: FC<ActionTypeProps> = ({ icon, title, onClick }) => {
	return (
		<Button
			type="primary"
			icon={icon}
			title={title}
			onClick={onClick}
		/>
	);
};