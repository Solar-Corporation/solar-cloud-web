import { Button } from 'antd';
import { FC, ReactNode } from 'react';

interface ControlTypeProps {
	icon: ReactNode;
	title: string;
	onClick: () => void;
	children?: never;
}

export const Control: FC<ControlTypeProps> = ({ icon, title, onClick }) => {
	return (
		<Button
			type="ghost"
			icon={icon}
			title={title}
			onClick={onClick}
		/>
	);
};