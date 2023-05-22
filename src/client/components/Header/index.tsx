import { QuestionOutlined, SettingOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { RouteNames } from '../../router';
import styles from '../../styles/components/Header.module.less';
import { HeaderAvatar } from './Avatar';
import { HeaderLinks, IHeaderLink } from './Links';
import { HeaderLogo } from './Logo';
import { HeaderSearch } from './Search';

export const Header: FC = () => {
	const links: IHeaderLink[] = [
		// { icon: <QuestionOutlined />, title: 'Справка' },
		{ icon: <SettingOutlined />, title: 'Настройки', href: RouteNames.SETTINGS }
	];

	return (
		<header className={styles.container}>
			<div className={styles.side}>
				<HeaderLogo />
				<HeaderSearch />
			</div>
			<div className={styles.side}>
				<HeaderLinks links={links} />
				<HeaderAvatar />
			</div>
		</header>
	);
};