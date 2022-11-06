import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { FC } from 'react';
import styles from '../../styles/components/Header.module.css';

export const HeaderAvatar: FC = () => {
  return (
    <div className={styles.avatar} title="Профиль">
      <Avatar size="large" icon={<UserOutlined />} />
      <div className={styles.avatarOverlay} />
    </div>
  );
};
