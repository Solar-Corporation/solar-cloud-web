import { Button } from 'antd';
import { FC, ReactNode } from 'react';
import { fontRoboto } from '../../../../pages/_app';
import styles from '../../../styles/components/Control.module.less';

export interface ControlTypeProps {
	type?: 'default' | 'primary' | 'ghost';
	block?: boolean;
	className?: string;
}

interface ControlProps extends ControlTypeProps {
	icon: ReactNode;
	title: string;
	onClick?: () => void;
	disabled?: boolean;
	loading?: boolean;
	disablePropagation?: boolean;
	children?: never;
}

export const Control: FC<ControlProps> = ({
	                                          icon,
	                                          title,
	                                          onClick,
	                                          disabled,
	                                          loading,
	                                          disablePropagation,
	                                          block,
	                                          type,
	                                          className
                                          }) => {
	const handleStopPropagation = (event: any) => {
		event.stopPropagation();
	};

	const handleClick = (event: any) => {
		if (!disablePropagation) handleStopPropagation(event);
		if (onClick) onClick();
	};

	return (
		<Button
			title={block ? undefined : title}
			icon={icon}
			className={block ? className ? `${styles.main} ${className}` : styles.main : className}
			type={type}
			disabled={disabled}
			loading={loading}
			size={block ? 'small' : undefined}
			onClick={handleClick}
			onContextMenu={handleStopPropagation}
		>
			{block ? <span className={fontRoboto.className}>{title}</span> : undefined}
		</Button>
	);
};