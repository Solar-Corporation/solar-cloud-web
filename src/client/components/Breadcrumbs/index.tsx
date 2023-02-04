import { RightOutlined } from '@ant-design/icons';
import { FC } from 'react';
import styles from '../../styles/components/Breadcrumbs.module.less';
import Action, { ActionList } from '../UI/Action/List';
import { BreadcrumbsItem } from './Item';

export interface IBreadcrumbsItem {
	title: string;
	href: string;
}

interface BreadcrumbsProps {
	links: IBreadcrumbsItem[];
	actions?: Action[];
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ links, actions }) => {
	return (
		<div className={styles.container}>
			{links.map((link, index) => [
				links.length === 1 ? <BreadcrumbsItem key={index} link={link} active /> :
					<BreadcrumbsItem key={index} link={link} />,
				(index !== links.length - 1) && <RightOutlined key={`separator${index}`} className={styles.separator} />
			])}
			{actions && actions.length > 0 && <>
        <RightOutlined className={styles.separator} />
        <ActionList list={actions} />
      </>}
		</div>
	);
};