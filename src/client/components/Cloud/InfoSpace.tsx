import { Progress } from 'antd';
import { FC } from 'react';
import styles from '../../styles/components/CloudInfoSpace.module.css';
import { ButtonIncrease } from '../UI/ButtonIncrease';

export const CloudInfoSpace: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.indicator}>
        <Progress
          strokeColor={{
            '0%': 'var(--color-calendula-gold)',
            '100%': 'var(--color-calendula-gold)',
          }}
          percent={13.4}
          showInfo={false}
        />
        <span>Осталось 12,16 ГБ из 15 ГБ</span>
      </div>
      <ButtonIncrease />
    </div>
  );
};
