import { DeleteFilled } from '@ant-design/icons';
import { Result } from 'antd';
import { FC } from 'react';
import styles from '../../styles/components/Result.module.less';

export const ResultEmptyTrash: FC = () => {
	return (
		<div className={styles.container}>
			<Result
				icon={<DeleteFilled className={styles.icon__trash} />}
				title="Корзина пуста"
			/>
		</div>
	);
};