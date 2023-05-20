import { LinkOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { FC, useEffect, useState, MouseEvent } from 'react';
import { useCloudReducer } from '../../../../hooks/cloud';
import { filesAPI } from '../../../../services/FilesService';
import { Control, ControlTypeProps } from '../index';
import ControlType, { getControlType } from '../List';
import styles from '../../../../styles/components/Control.module.less';

export const ControlShare: FC<ControlTypeProps> = ({ type, block, className }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isShared, setIsShared] = useState(false);
	const { context, selected, shared, directoryShared, isFilesContextMenuOpen } = useCloudReducer();
	const [shareFile] = filesAPI.useCreateShareLinkMutation();

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

	const handleClick = async () => {
		if (!isShared) {
			await shareFile(selected.length ? selected[0].hash : context.hash || '');
		} else {
			setIsMenuOpen(true);
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) setIsMenuOpen(false);
	};

	useEffect(() => {
		if (selected.length) {
			setIsShared(!!shared.find(hash => hash === selected[0].hash));
		} else {
			setIsShared(directoryShared);
		}
	}, [selected, shared, directoryShared]);

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