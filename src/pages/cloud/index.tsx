import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { CloudLayout } from '../../client/components/Cloud/Layout';
import { FileTable } from '../../client/components/FileTable';
import { Action } from '../../client/components/UI/Action/List';
import { Control } from '../../client/components/UI/Control/List';
import { RouteNames } from '../../client/router';
import { filesAPI } from '../../client/services/FilesService';
import { wrapper } from '../../client/store';
import { setInitialUserData } from '../../client/store/reducers/UserSlice';

export default function Cloud({  }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const files = [
		{
			name: "test123.txt",
			path: "/test123.txt",
			size: "7 B",
			fileType: "txt",
			mimeType: "text/plain",
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		},
		{
			name: "test",
			path: "/test",
			size: "4.00 KiB",
			fileType: "",
			mimeType: "text/plain",
			isDir: true,
			isFavorite: false,
			seeTime: 1673379696000
		}
	];

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

	return (
		<CloudLayout
			title="Все файлы"
			headingOptions={headingOptions}
		>
			{/*<button onClick={handleClick}>Открыть папку</button>*/}
			{files && <FileTable files={files} />}
		</CloudLayout>
	);
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(store => async ctx => {
	setInitialUserData(ctx, store.dispatch);

	const { data: files } = await store.dispatch(filesAPI.endpoints.getFiles.initiate('/'));
	console.log('files', files);
	return { props: { files: files || null } };
});