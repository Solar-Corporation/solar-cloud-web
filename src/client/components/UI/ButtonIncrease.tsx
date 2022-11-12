import { ShoppingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FC } from 'react';
import styles from '../../styles/components/ButtonIncrease.module.css';

export const ButtonIncrease: FC = () => {
	return (
		<Button
			className={styles.main}
			type="primary"
			size="large"
			icon={<ShoppingOutlined />}
			block
		>
			Увеличить хранилище
		</Button>
	);
};
