import { CloudUploadOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Tooltip } from 'antd';
import { FC, useEffect, useState } from 'react';
import styles from '../../styles/components/ButtonUpload.module.less';
import { variables } from '../../styles/theme';
import Control, { getControlType } from '../UI/Control/List';

export const ButtonUpload: FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const menu = (
		<ul className={styles.menu}>
			{[Control.UPLOAD, Control.UPLOAD_FOLDER].map((type, index) =>
				<li key={index} className={styles.item}>{getControlType(type, index, 'primary', true, styles.control)}</li>
			)}
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