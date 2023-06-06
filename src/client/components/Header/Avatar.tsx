import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, MenuProps } from 'antd';
import { FC, useState } from 'react';
import { useAppSelector } from '../../hooks/redux';
import styles from '../../styles/components/Header.module.less';
import stylesContextMenu from '../../styles/components/ContextMenu.module.less';
import { ControlLogout } from '../UI/Control/types/Logout';

export const HeaderAvatar: FC = () => {
	const { data } = useAppSelector(state => state.userReducer);
	const [user] = useState(data);

	const items: MenuProps['items'] = [
		{
			key: 'user',
			label: (
				<div className={styles.user}>
					<Avatar
						icon={<UserOutlined/>}
					/>
					<div className={styles.user__label}>
						<div className={styles.user__name}>{`${user?.fullName.lastName} ${user?.fullName.firstName}`}</div>
						<div className={styles.user__email}>{user?.email}</div>
					</div>
				</div>
			)
		},
		{ type: 'divider' },
		{
			key: 'logout',
			label: <ControlLogout type="primary" block />
		}
	];

	return (
		<Dropdown
			menu={{ items }}
			trigger={['click']}
			overlayClassName={`${stylesContextMenu.main} ${styles.avatar__menu}`}
			arrow
		>
			<div className={styles.avatar} title="Профиль">
				<Avatar size="large" icon={<UserOutlined />} />
				<div className={styles.avatarOverlay} />
			</div>
		</Dropdown>
	);
};