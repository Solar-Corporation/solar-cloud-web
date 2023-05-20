import { CloudServerOutlined } from '@ant-design/icons';
import { Progress } from 'antd';
import { FC } from 'react';
import { IStorageSpace } from '../../models/IFile';
import styles from '../../styles/components/CloudInfoSpace.module.less';
import { variables } from '../../styles/theme';

export const CloudInfoSpace: FC<IStorageSpace> = ({ percent, usageSpace, totalSpace }) => {
	return (
		<div className={styles.container}>
			<div className={styles.title}>
				<CloudServerOutlined />
				<span className={styles.titleText}>Хранилище</span>
			</div>
			<div className={styles.info}>
				<span className={styles.space}>{usageSpace} </span>|<span className={styles.space}> </span>{totalSpace}
			</div>
			<Progress
				strokeColor={
					percent > 35
						? percent > 70
							? percent > 99
								? variables['@alert']
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