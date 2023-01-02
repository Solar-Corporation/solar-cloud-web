import { CloudUploadOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Dropdown, MenuProps, Upload } from 'antd';
import { FC, useEffect, useState } from 'react';
import styles from '../../styles/components/ButtonUpload.module.less';
import { variables } from '../../styles/theme';

export const ButtonUpload: FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const menu: MenuProps['items'] = [
		{
			key: 0,
			label: <Upload name="file" className={styles.upload} fileList={[]} multiple>
				<div className={styles.item}>Загрузить файл</div>
			</Upload>,
			onClick: () => {
				console.log('click');
			}
		},
		{
			key: 1,
			label: <Upload name="folder" fileList={[]} directory>
				<div className={styles.item}>Загрузить папку</div>
			</Upload>
		}
	];

	useEffect(() => {
		window.addEventListener('scroll', () => setIsMenuOpen(false));
		return () => {
			window.removeEventListener('scroll', () => setIsMenuOpen(false));
		};
	}, []);

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
			<Dropdown
				menu={{ items: menu }}
				trigger={['click']}
				overlayClassName={styles.dropdown}
				open={isMenuOpen}
				onOpenChange={(isOpen) => setIsMenuOpen(isOpen)}
			>
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
