import { RightOutlined } from '@ant-design/icons';
import { FC } from 'react';
import styles from '../../styles/components/Breadcrumbs.module.less';
import Control, { ControlList } from '../UI/Control/List';
import { BreadcrumbsItem } from './Item';

export interface IBreadcrumbsItem {
	title: string;
	href: string;
}

interface BreadcrumbsProps {
	links: IBreadcrumbsItem[];
	actions?: Control[];
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ links, actions }) => {
	return (
		<div className={styles.container}>
			{links.length > 1
				? links.map((link, index) => [
					<BreadcrumbsItem key={index} link={link} />,
					(index !== links.length - 1) && <RightOutlined key={`separator${index}`} className={styles.separator} />])
				: <BreadcrumbsItem link={links[0]} active />}
			{actions && actions.length > 0 && [
				<RightOutlined className={styles.separator} />,
				<ControlList list={actions} type="primary" />
			]}
		</div>
	);
};