import { MoreOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { FC, ReactNode, useEffect, useState } from 'react';
import stylesContextMenu from '../../../../styles/components/ContextMenu.module.less';
import styles from '../../../../styles/components/Control.module.less';
import { getContextMenuItems } from '../../../ContextMenu';
import { Control, ControlTypeProps } from '../index';
import ControlType from '../List';

interface ControlMoreProps extends ControlTypeProps {
	list: ControlType[];
}

export const ControlMore: FC<ControlMoreProps> = ({ list, type, block, className }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

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

	useEffect(() => {
		window.addEventListener('scroll', () => setIsMenuOpen(false));
		return () => {
			window.removeEventListener('scroll', () => setIsMenuOpen(false));
		};
	}, []);

	return (
		<Dropdown
			menu={{ items: getContextMenuItems(list) }}
			placement="bottomRight"
			open={isMenuOpen}
			onOpenChange={(isOpen) => setIsMenuOpen(isOpen)}
			overlayClassName={`${stylesContextMenu.main} ${styles.dropdown}`}
			trigger={['click']}
			dropdownRender={dropdownRender}
			arrow
		>
			<Control
				icon={<MoreOutlined />}
				title="Ещё"
				className={className}
				type={type}
				block={block}
			/>
		</Dropdown>
	);
};