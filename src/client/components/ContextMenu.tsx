import { FC, ReactNode } from 'react';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import styles from '../styles/components/ContextMenu.module.less';
import Control, { getControlType } from './UI/Control/List';

interface ContextMenuProps {
	menu?: Control[];
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

export const ContextMenu: FC<ContextMenuProps> = ({ menu, children }) => {
	// const [isMenuOpen, setIsMenuOpen] = useState(false);
	//
	// const handleOpenChange = (isOpen: boolean) => {
	// 	setIsMenuOpen(isOpen);
	// };

	return (
		menu
			?
			<Dropdown
				menu={{ items: getContextMenuItems(menu, styles.control) }}
				trigger={['contextMenu']}
				overlayClassName={styles.main}
				// open={isMenuOpen}
				// onOpenChange={(isOpen) => setIsMenuOpen(isOpen)}
			>
				{children}
			</Dropdown>
			: <>{children}</>
	);
};