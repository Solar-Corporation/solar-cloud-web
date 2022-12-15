import { CloudUploadOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Upload } from 'antd';
import { FC } from 'react';
import { variables } from '../../styles/theme';
import styles from '../../styles/components/ButtonUpload.module.less';

export const ButtonUpload: FC = () => {
	return (
		<ConfigProvider
			theme={{
				components: {
					Button: {
						colorPrimary: variables['@orange-primary'],
						colorPrimaryHover: variables['@orange-secondary'],
						colorPrimaryActive: variables['@orange-secondary']
					}
				}
			}}
		>
			<Upload name="file" className={styles.upload}>
				<Button
					type="primary"
					size="large"
					icon={<CloudUploadOutlined />}
					block
				>
					Загрузить
				</Button>
			</Upload>
		</ConfigProvider>
	);
};
