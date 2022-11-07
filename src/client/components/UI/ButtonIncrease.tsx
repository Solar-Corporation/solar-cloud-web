import { FC } from 'react';
import { Button } from 'antd';
import styles from '../../styles/components/ButtonIncrease.module.css';
import { ShoppingOutlined } from '@ant-design/icons';

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
