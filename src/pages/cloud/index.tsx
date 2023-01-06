import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { CloudLayout } from '../../client/components/Cloud/Layout';
import { Action } from '../../client/components/UI/Action/List';
import { Control } from '../../client/components/UI/Control/List';
import { RouteNames } from '../../client/router';
import { filesAPI } from '../../client/services/FilesService';
import { wrapper } from '../../client/store';

export default function Cloud() {
	const id = 3432432;
	const router = useRouter();

	const headingOptions = {
		links: [{ title: 'Все файлы', href: RouteNames.CLOUD }],
		actions: [Action.CREATE],
		constControls: [Control.VIEW, Control.INFO],
		sticky: true
	};

	const handleClick = async () => {
		await router.push(`${RouteNames.CLOUD}?path=${id}`);
	};

	// const {data, error} = filesAPI.useGetFilesQuery('');

	return (
		<CloudLayout
			title="Все файлы"
			headingOptions={headingOptions}
		>
			{/*<button onClick={handleClick}>Открыть папку</button>*/}
			<div style={{ height: '1200px' }} />
		</CloudLayout>
	);
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async (ctx) => {
			// const { userReducer: { data }} = store.getState();
			// console.log('data', data);
			const files = await store.dispatch(filesAPI.endpoints.getFiles.initiate(''));
			console.log('files', files);
			return { props: {} };
		}
);
// export { getServerSideRefresh as getServerSideProps };