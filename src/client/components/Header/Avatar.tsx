import { UserOutlined } from '@ant-design/icons';
import { Avatar, Tooltip } from 'antd';
import { FC } from 'react';
import styles from '../../styles/components/Header.module.less';
import { tooltipShowDelay } from '../../utils';

export const HeaderAvatar: FC = () => {
	return (
		<Tooltip
			title="Профиль"
			mouseEnterDelay={tooltipShowDelay}
		>
			<div className={styles.avatar}>
				<Avatar size="large" icon={<UserOutlined />} />
				<div className={styles.avatarOverlay} />
			</div>
		</Tooltip>
	);
};