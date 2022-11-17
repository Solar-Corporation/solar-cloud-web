import { CloudUploadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FC } from 'react';
import styles from '../../styles/components/ButtonUpload.module.less';

export const ButtonUpload: FC = () => {
	return (
		<Button
			className={styles.main}
			type="primary"
			size="large"
			icon={<CloudUploadOutlined />}
			block
		>
			Загрузить
		</Button>
	);
};
