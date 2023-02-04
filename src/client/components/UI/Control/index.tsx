import { Button } from 'antd';
import { FC, ReactNode } from 'react';
import styles from '../../../styles/components/Control.module.less';

export interface ControlTypeProps {
	context?: boolean;
}

interface ControlProps {
	icon: ReactNode;
	title: string;
	onClick: () => void;
	children?: never;
	context?: boolean;
}

export const Control: FC<ControlProps> = ({ icon, title, onClick, context }) => {
	const handleClick = (event: any) => {
		event.stopPropagation();
		onClick();
	};

	return (
		context
			?
			<div
				className={styles.item}
				onClick={onClick}
			>
				{icon}
				<span>{title}</span>
			</div>
			:
			<Button
				title={title}
				type="ghost"
				icon={icon}
				onClick={event => handleClick(event)}
			/>
	);
};