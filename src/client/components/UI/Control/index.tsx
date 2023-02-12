import { Roboto } from '@next/font/google';
import { Button } from 'antd';
import { FC, ReactNode } from 'react';
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
	disablePropagation?: boolean;
	children?: never;
}

const roboto = Roboto({ subsets: ['latin', 'cyrillic'], weight: ['400', '500'] });

export const Control: FC<ControlProps> = ({
	                                          icon,
	                                          title,
	                                          onClick,
	                                          disabled,
	                                          disablePropagation,
	                                          block,
	                                          type,
	                                          className
                                          }) => {
	const handleClick = (event: any) => {
		if (!disablePropagation) event.stopPropagation();
		if (onClick) onClick();
	};

	return (
		<Button
			title={block ? undefined : title}
			icon={icon}
			className={block ? className ? `${styles.main} ${className}` : styles.main : className}
			type={type}
			disabled={disabled}
			onClick={handleClick}
		>
			{block ? <span className={`${styles.title} ${roboto.className}`}>{title}</span> : undefined}
		</Button>
	);
};