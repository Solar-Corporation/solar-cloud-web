import { RightOutlined } from '@ant-design/icons';
import { FC } from 'react';
import styles from '../../styles/components/Breadcrumbs.module.less';
import { BreadcrumbsItem } from './Item';
import Control, { ControlList } from '../UI/Control/List';

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
			{links.map((link, index) => [
				links.length === 1 ? <BreadcrumbsItem key={index} link={link} active /> :
					<BreadcrumbsItem key={index} link={link} />,
				(index !== links.length - 1) && <RightOutlined key={`separator${index}`} className={styles.separator} />
			])}
			{actions && actions.length > 0 && <>
        <RightOutlined className={styles.separator} />
        <ControlList list={actions} type="primary" />
      </>}
		</div>
	);
};