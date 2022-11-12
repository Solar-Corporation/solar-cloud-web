import { CloudServerOutlined } from '@ant-design/icons';
import { Progress } from 'antd';
import { FC } from 'react';
import styles from '../../styles/components/CloudInfoSpace.module.css';

interface CloudInfoSpaceProps {
	used: number;
	total: number;
}

export const CloudInfoSpace: FC<CloudInfoSpaceProps> = ({ used, total }) => {
	const percent = (used / total) * 100;

	return (
		<div className={styles.container}>
			<div className={styles.title}>
				<CloudServerOutlined />
				<span className={styles.titleText}>Хранилище</span>
			</div>
			<div className={styles.info}>
				<span className={styles.space}>{used} ГБ </span>|
				<span className={styles.space}> </span>
				{total} ГБ
			</div>
			<Progress
				strokeColor={
					percent > 35
						? percent > 70
							? percent > 99
								? 'var(--color-red)'
								: 'var(--color-magenta)'
							: 'var(--color-sunset-orange)'
						: 'var(--color-calendula-gold)'
				}
				trailColor={'rgba(0, 0, 0, 0.2)'}
				percent={percent}
				showInfo={false}
			/>
		</div>
	);
};
