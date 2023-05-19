import { LinkOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { FC, useEffect, useState, MouseEvent } from 'react';
import { useCloudReducer } from '../../../../hooks/cloud';
import { setIsFilesContextMenuOpen, shareFile } from '../../../../store/reducers/CloudSlice';
import { Control, ControlTypeProps } from '../index';
import ControlType, { getControlType } from '../List';
import styles from '../../../../styles/components/Control.module.less';

export const ControlShare: FC<ControlTypeProps> = ({ type, block, className }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isShared, setIsShared] = useState(false);
	const { selected, shared, isFilesContextMenuOpen,dispatch } = useCloudReducer();

	const menu = () => {
		const handleClick = (event: MouseEvent<HTMLLIElement>) => {
			event.stopPropagation();
			setIsMenuOpen(false);
		};

		return (
			<ul className={styles.shared__menu}>
				{[ControlType.COPY_LINK, ControlType.DELETE_LINK].map((type, index) =>
					<li
						key={index}
						className={styles.shared__menu__item}
						onClick={handleClick}
					>
						{getControlType(type, index, 'primary', true)}
					</li>
				)}
			</ul>
		);
	};

	const handleClick = () => {
		// subject to change
		if (!isShared) {
			dispatch(setIsFilesContextMenuOpen(false));
			dispatch(shareFile(selected[0].path));
		} else {
			setIsMenuOpen(true);
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) setIsMenuOpen(false);
	};

	useEffect(() => {
		if (selected.length) {
			setIsShared(!!shared.find(path => path === selected[0].path));
		}
	}, [selected, shared]);

	useEffect(() => {
		window.addEventListener('scroll', () => setIsMenuOpen(false));
		return () => {
			window.removeEventListener('scroll', () => setIsMenuOpen(false));
		};
	}, []);

	useEffect(() => {
		if (!isFilesContextMenuOpen) setIsMenuOpen(false);
	}, [isFilesContextMenuOpen]);

	return (
		<Tooltip
			trigger="click"
			title={menu}
			placement={block ? 'rightTop' : 'bottomRight'}
			open={isMenuOpen}
			onOpenChange={handleOpenChange}
		>
			<Control
				icon={<LinkOutlined />}
				title="Поделиться"
				onClick={handleClick}
				className={className}
				type={type}
				block={block}
			/>
		</Tooltip>
	);
};