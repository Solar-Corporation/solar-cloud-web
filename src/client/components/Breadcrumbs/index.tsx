import { RightOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { useAppSelector } from '../../hooks/redux';
import styles from '../../styles/components/Breadcrumbs.module.less';
import { pxToNumber } from '../../utils';
import Control, { ControlList } from '../UI/Control/List';
import { BreadcrumbsItem } from './Item';
import { variables } from '../../styles/theme';

export interface IBreadcrumbsItem {
	title: string;
	href: string;
}

interface BreadcrumbsProps {
	links: IBreadcrumbsItem[];
	actions?: Control[];
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ links, actions }) => {
	const { url } = useAppSelector(state => state.cloudReducer.context);

	return (
		<div className={styles.container}>
			{links.length > 1
				? links.map((link, index) => [
					<BreadcrumbsItem
						key={index}
						link={link}
						style={{
							maxWidth: `calc((100vw - ${pxToNumber(variables['@space-xl']) * 2 + pxToNumber(variables['@space-xl']) + pxToNumber(variables['@sidebar-width'])}px - ${pxToNumber(variables['@space-6xl']) + 32 * 10 + pxToNumber(variables['@space-xs']) * 10}px) / ${links.length > 4 ? 4 : links.length})`
						}}
						active={url === link.href}
					/>,
					(index !== links.length - 1) && <RightOutlined key={`separator${index}`} className={styles.separator} />])
				: <BreadcrumbsItem link={links[0]} active />}
			{actions && actions.length > 0 && <>
				<RightOutlined className={styles.separator} />
				<ControlList list={actions} type="primary" />
			</>}
		</div>
	);
};