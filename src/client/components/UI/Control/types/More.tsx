import { FC, useEffect, useState } from 'react';
import { Control, ControlTypeProps } from '../index';
import { MoreOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import styles from '../../../../styles/components/Control.module.less';
import stylesContextMenu from '../../../../styles/components/ContextMenu.module.less';
import ControlType from '../List';
import { getContextMenuItems } from '../../../ContextMenu';

interface ControlMoreProps extends ControlTypeProps {
	list: ControlType[];
}

export const ControlMore: FC<ControlMoreProps> = ({ list, type, block, className }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleClick = ({ domEvent: event }: any) => {
		event.stopPropagation();
	};

	useEffect(() => {
		window.addEventListener('scroll', () => setIsMenuOpen(false));
		return () => {
			window.removeEventListener('scroll', () => setIsMenuOpen(false));
		};
	}, []);

	return (
		<Dropdown
			menu={{ items: getContextMenuItems(list), onClick: handleClick }}
			placement="bottomRight"
			open={isMenuOpen}
			onOpenChange={(isOpen) => setIsMenuOpen(isOpen)}
			overlayClassName={`${stylesContextMenu.main} ${styles.dropdown}`}
			trigger={['click']}
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