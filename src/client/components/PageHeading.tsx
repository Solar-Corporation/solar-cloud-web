import { FC, ReactNode } from 'react';
import { Breadcrumbs, IBreadcrumbsItem } from './Breadcrumbs';

interface PageHeadingProps {
	links: IBreadcrumbsItem[];
	actions?: ReactNode;
}

export const PageHeading: FC<PageHeadingProps> = ({ links, actions }) => {
	return (
		<div>
			<Breadcrumbs links={links} actions={actions} />
		</div>
	);
};