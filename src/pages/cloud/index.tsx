import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { CloudLayout } from '../../client/components/Cloud/Layout';
import { FileTable } from '../../client/components/FileTable';
import Control from '../../client/components/UI/Control/List';
import { useCloudReducer } from '../../client/hooks/cloud';
import { IFile } from '../../client/models/IFile';
import { RouteNames } from '../../client/router';
import { filesAPI } from '../../client/services/FilesService';
import { wrapper } from '../../client/store';
import { clearSelected, selectFile, setContext, unselectFile } from '../../client/store/reducers/CloudSlice';
import { setInitialUserData } from '../../client/store/reducers/UserSlice';
import { getFilesPlaceholder, getHasDir, getLinks } from '../../client/utils';

export default function Cloud({ files, path, links }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { selected, marked, dispatch } = useCloudReducer();
	const router = useRouter();
	if (!files) files = getFilesPlaceholder();

	const floatControls = selected.length
		? selected.length > 1
			? getHasDir(selected)
				? [Control.SHARE, Control.DELETE, Control.MOVE, Control.COPY]
				: [Control.SHARE, Control.DOWNLOAD, Control.DELETE, Control.MOVE, Control.COPY]
			: getHasDir(selected)
				? [Control.SHARE, Control.DELETE, Control.RENAME, Control.MOVE, Control.COPY, Control.MARK]
				: [Control.SHARE, Control.DOWNLOAD, Control.DELETE, Control.RENAME, Control.MOVE, Control.COPY, Control.MARK]
		: path !== '/' ? [Control.SHARE] : undefined;

	const headingOptions = {
		links,
		actions: [Control.CREATE],
		constControls: [Control.VIEW, Control.INFO],
		floatControls: floatControls,
		sticky: true
	};

	const contextMenu = path !== '/'
		? [Control.CREATE, Control.NULL, Control.UPLOAD, Control.UPLOAD_FOLDER, Control.NULL, Control.SHARE, Control.NULL, Control.VIEW, Control.INFO]
		: [Control.CREATE, Control.NULL, Control.UPLOAD, Control.UPLOAD_FOLDER, Control.NULL, Control.VIEW, Control.INFO];
	const filesContextMenu = selected.length > 1
		? getHasDir(selected)
			? [Control.SHARE, Control.DELETE, Control.NULL, Control.MOVE, Control.COPY, Control.NULL, Control.INFO]
			: [Control.SHARE, Control.DOWNLOAD, Control.DELETE, Control.NULL, Control.MOVE, Control.COPY, Control.NULL, Control.INFO]
		: getHasDir(selected)
			?	[Control.SHARE, Control.DELETE, Control.NULL, Control.RENAME, Control.MOVE, Control.COPY, Control.MARK, Control.NULL, Control.INFO]
			: [Control.SHARE, Control.DOWNLOAD, Control.DELETE, Control.NULL, Control.RENAME, Control.MOVE, Control.COPY, Control.MARK, Control.NULL, Control.INFO];

	const handleRowClick = async (event: any, file: IFile, isSelected: boolean) => {
		switch (event.detail) {
			case 1: {
				if (event.ctrlKey) {
					if (!isSelected) {
						dispatch(selectFile(file));
					} else {
						dispatch(unselectFile(file));
					}
				} else {
					if (selected.length > 1) {
						dispatch(clearSelected());
						dispatch(selectFile(file));
					} else {
						if (!isSelected) {
							dispatch(clearSelected());
							dispatch(selectFile(file));
						}
					}
				}
				break;
			}
			case 2: {
				if (file.isDir) {
					await router.push(`${RouteNames.CLOUD}?path=${file.path}`);
				} else {
					console.log('double click!');
				}
				break;
			}
			default:
				break;
		}
	};

	const handleRowContextMenu = (event: any, file: IFile, isSelected: boolean) => {
		if (!isSelected) {
			dispatch(clearSelected());
			dispatch(selectFile(file));
		}
	};

	return (
		<CloudLayout
			title="Все файлы"
			headingOptions={headingOptions}
			contextMenu={contextMenu}
		>
			{files && (
				<FileTable
					files={files}
					contextMenu={filesContextMenu}
					selected={selected}
					marked={marked}
					onRowClick={handleRowClick}
					onRowContextMenu={handleRowContextMenu}
				/>
			)}
		</CloudLayout>
	);
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(store => async ctx => {
	const { dispatch } = store;
	const url = decodeURIComponent(ctx.resolvedUrl);
	const path = ctx.query.path?.toString() || '/';
	const links = getLinks(path);
	setInitialUserData(ctx, dispatch);
	dispatch(setContext({ url, path }));
	const { data: files } = await store.dispatch(filesAPI.endpoints.getFiles.initiate(path));
	return { props: { files: files || null, path, links } };
});