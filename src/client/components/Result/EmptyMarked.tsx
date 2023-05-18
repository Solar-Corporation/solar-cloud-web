import { StarFilled } from '@ant-design/icons';
import { Result } from 'antd';
import { FC } from 'react';
import styles from '../../styles/components/Result.module.less';

export const ResultEmptyMarked: FC = () => {
	return (
		<div className={styles.container}>
			<Result
				icon={<StarFilled className={styles.icon} />}
				title="Нет избранных файлов"
			/>
		</div>
	);
};