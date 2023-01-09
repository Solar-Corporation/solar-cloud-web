import { CloudServerOutlined } from '@ant-design/icons';
import { Progress } from 'antd';
import { FC } from 'react';
import styles from '../../styles/components/CloudInfoSpace.module.less';
import { variables } from '../../styles/theme';

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
								? variables['@red']
								: variables['@magenta-primary']
							: variables['@orange-primary']
						: variables['@gold-primary']
				}
				trailColor={'rgba(0, 0, 0, 0.2)'}
				percent={percent}
				showInfo={false}
			/>
		</div>
	);
};