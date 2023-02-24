import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { FC, ReactNode } from 'react';
import styles from '../styles/components/ContextMenu.module.less';
import Control, { getControlType } from './UI/Control/List';

interface ContextMenuProps {
	menu?: Control[];
	open?: boolean;
	onOpenChange?: (isOpen: boolean) => void;
	children: ReactNode;
}

export const getContextMenuItems = (list: Control[], className?: string): MenuProps['items'] => {
	return list.map((type, index) =>
		type !== Control.NULL
			? {
				key: `${index}`,
				label: getControlType(type, index, 'primary', true, className)
			} : {
				key: `${index}`,
				label: <div className={styles.divider} />
			}
	);
};

export const ContextMenu: FC<ContextMenuProps> = ({ menu, open, onOpenChange, children }) => {
	const dropdownRender = (menus: ReactNode) => {
		const handleClick = (event: any) => {
			event.stopPropagation();
		};

		return (
			<div onClick={handleClick} onContextMenu={handleClick}>
				{menus}
			</div>
		);
	};

	return (
		menu
			?
			<Dropdown
				menu={{ items: getContextMenuItems(menu, styles.control) }}
				trigger={['contextMenu']}
				open={open}
				onOpenChange={onOpenChange}
				overlayClassName={styles.main}
				dropdownRender={dropdownRender}
			>
				{children}
			</Dropdown>
			: <>{children}</>
	);
};