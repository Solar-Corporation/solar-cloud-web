import { FC, useEffect, useState } from 'react';
import { Control } from '../index';
import { MoreOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import styles from '../../../../styles/components/Control.module.less';
import stylesContextMenu from '../../../../styles/components/ContextMenu.module.less';
import ControlType, { getControlType } from '../List';

interface ControlMoreProps {
	list: ControlType[];
	context?: boolean;
	primary?: boolean;
}

export const ControlMore: FC<ControlMoreProps> = ({ list, context, primary }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const items = list.map((type, index) => ({
		key: `${index}`,
		label: getControlType(type, index, false, true)
	}));

	const handleOpenChange = (open: boolean) => {
		setIsMenuOpen(open);
	};

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
			menu={{ items, onClick: handleClick }}
			placement="bottomRight"
			open={isMenuOpen}
			onOpenChange={handleOpenChange}
			overlayClassName={`${styles.dropdown} ${stylesContextMenu.main}`}
			trigger={['click']}
			arrow
		>
			<Control
				icon={<MoreOutlined />}
				title="Ещё"
				primary={primary}
				context={context}
			/>
		</Dropdown>
	);
};