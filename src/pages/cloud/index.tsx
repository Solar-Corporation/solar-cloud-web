import { getServerSideRefresh } from 'src/client/utils';
import { CloudLayout } from '../../client/components/Cloud/Layout';
import { Action } from '../../client/components/UI/Action/List';
import { Control } from '../../client/components/UI/Control/List';
import { useAppSelector } from '../../client/hooks/redux';
import { RouteNames } from '../../client/router';

export default function Cloud() {
	const headingOptions = {
		links: [{ title: 'Все файлы', href: RouteNames.CLOUD }],
		actions: [Action.CREATE],
		constControls: [Control.VIEW, Control.INFO],
		sticky: true
	};

	return (
		<CloudLayout
			title="Все файлы"
			headingOptions={headingOptions}
		>
			<div style={{ height: '1200px' }} />
		</CloudLayout>
	);
}

// export { getServerSideRefresh as getServerSideProps };