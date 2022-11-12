import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import Logo from '../../img/logo.svg';
import { RouteNames } from '../../router';
import styles from '../../styles/components/Header.module.css';

export const HeaderLogo: FC = () => {
	return (
		<Link href={RouteNames.CLOUD}>
			<Image src={Logo} alt="" className={styles.logo} />
		</Link>
	);
};
