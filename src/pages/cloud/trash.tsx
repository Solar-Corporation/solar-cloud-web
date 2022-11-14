import { CloudLayout } from '../../client/components/Cloud/Layout';
import { Control } from '../../client/components/UI/Control/List';
import { RouteNames } from '../../client/router';

export default function Cloud() {
	const headingOptions = {
		links: [{ title: 'Корзина', href: RouteNames.TRASH }],
		constControls: [Control.VIEW, Control.INFO],
		sticky: true
	};

	return (
		<CloudLayout
			title="Корзина"
			headingOptions={headingOptions}
		>
			<div style={{ height: '1200px' }} />
		</CloudLayout>
	);
}
