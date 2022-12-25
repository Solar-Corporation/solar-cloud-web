import { CloudUploadOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Dropdown, MenuProps, Upload } from 'antd';
import { FC } from 'react';
import styles from '../../styles/components/ButtonUpload.module.less';
import { variables } from '../../styles/theme';

export const ButtonUpload: FC = () => {
	const menu: MenuProps['items'] = [
		{
			label: <Upload name="file" className={styles.upload}>Загрузить файл</Upload>,
			key: 0,
			onClick: () => {
				console.log('click');
			}
		},
		{
			label: <Upload name="file">Загрузить папку</Upload>,
			key: 1
		}
	];

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
			<Dropdown menu={{ items: menu }} trigger={['click']}>
				<Button
					type="primary"
					size="large"
					icon={<CloudUploadOutlined />}
					block
				>
					Загрузить
				</Button>
			</Dropdown>
		</ConfigProvider>
	);
};
