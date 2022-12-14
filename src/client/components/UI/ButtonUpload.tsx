import { CloudUploadOutlined } from '@ant-design/icons';
import { Button, ConfigProvider } from 'antd';
import { FC } from 'react';
import { variables } from '../../styles/theme';

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
			<Button
				type="primary"
				size="large"
				icon={<CloudUploadOutlined />}
				block
			>
				Загрузить
			</Button>
		</ConfigProvider>
	);
};
