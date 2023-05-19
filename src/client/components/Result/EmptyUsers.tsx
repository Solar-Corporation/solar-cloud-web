import { UsergroupDeleteOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import { FC } from 'react';
import styles from '../../styles/components/Result.module.less';

export const ResultEmptyUsers: FC = () => {
	return (
		<div className={styles.container}>
			<Result
				icon={<UsergroupDeleteOutlined className={styles.icon__file} />}
				title="Нет пользователей"
			/>
		</div>
	);
};