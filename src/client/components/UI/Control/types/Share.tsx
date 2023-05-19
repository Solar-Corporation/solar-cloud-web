import { LinkOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useCloudReducer } from '../../../../hooks/cloud';
import { setIsFilesContextMenuOpen, shareFile } from '../../../../store/reducers/CloudSlice';
import { Control, ControlTypeProps } from '../index';
import { ControlCopyLink } from './CopyLink';
import { ControlDeleteLink } from './DeleteLink';
import styles from '../../../../styles/components/ContextMenu.module.less';

export const ControlShare: FC<ControlTypeProps> = ({ type, block, className }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isShared, setIsShared] = useState(false);
	const { selected, shared, dispatch } = useCloudReducer();

	const items = [
		{
			key: 'copy',
			label: <ControlCopyLink type="primary" block />,
			onClick: () => setIsMenuOpen(false)
		},
		{
			key: 'delete',
			label: <ControlDeleteLink type="primary" block />,
			onClick: () => setIsMenuOpen(false)
		}
	];

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

	return (
		<Dropdown
			open={isMenuOpen}
			trigger={['click']}
			menu={{ items }}
			overlayClassName={styles.main}
			placement="bottomLeft"
			onOpenChange={handleOpenChange}
			arrow
		>
			<Control
				icon={<LinkOutlined />}
				title="Поделиться"
				onClick={handleClick}
				className={className}
				type={type}
				block={block}
			/>
		</Dropdown>
	);
};