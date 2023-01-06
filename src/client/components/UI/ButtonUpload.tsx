import { CloudUploadOutlined, FileAddOutlined, FolderAddOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Tooltip, Upload } from 'antd';
import { FC, useEffect, useState } from 'react';
import styles from '../../styles/components/ButtonUpload.module.less';
import { variables } from '../../styles/theme';

export const ButtonUpload: FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const menu = (
		<ul className={styles.menu}>
			<li>
				<Upload name="file" className={styles.upload} fileList={[]} multiple>
					<div className={styles.item}><FileAddOutlined className={styles.icon} /><span>Загрузить файлы</span></div>
				</Upload>
			</li>
			<li>
				<Upload name="folder" fileList={[]} directory>
					<div className={styles.item}><FolderAddOutlined className={styles.icon} /><span>Загрузить папку</span></div>
				</Upload>
			</li>
		</ul>
	);

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
			<Tooltip
				trigger="click"
				title={menu}
				placement="bottom"
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
			</Tooltip>
		</ConfigProvider>
	);
};