import { FC, useEffect, useState } from 'react';
import styles from '../styles/components/PageHeading.module.less';
import { Breadcrumbs, IBreadcrumbsItem } from './Breadcrumbs';
import Control, { ControlList } from './UI/Control/List';

export interface PageHeadingProps {
	links: IBreadcrumbsItem[];
	actions?: Control[];
	floatControls?: Control[];
	constControls?: Control[];
	sticky?: boolean;
}

export const PageHeading: FC<PageHeadingProps> = ({ links, actions, floatControls, constControls, sticky }) => {
	const [isSticky, setIsSticky] = useState(false);

	const handleStick = () => {
		if (window.scrollY >= 90) {
			setIsSticky(true);
		} else {
			setIsSticky(false);
		}
	};

	useEffect(() => {
		if (sticky) {
			window.addEventListener('scroll', handleStick);
		}
		return () => {
			window.removeEventListener('scroll', handleStick);
		};
	}, []);

	return (
		<div
			className={
				sticky
					? isSticky
						? `${styles.container} ${styles.sticky} ${styles.sticky_active}`
						: `${styles.container} ${styles.sticky}`
					: styles.container
			}
		>
			<Breadcrumbs links={links} actions={actions} />
			{((floatControls && floatControls.length > 0) || (constControls && constControls.length > 0)) &&
				<div className={styles.controls}>
					{floatControls && <>
						<ControlList list={floatControls} type="ghost" />
						<div className={styles.controlsDivider} />
					</>}
					{constControls && <ControlList list={constControls} type="ghost" />}
				</div>}
		</div>
	);
};