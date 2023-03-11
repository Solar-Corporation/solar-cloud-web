import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { CloudLayout } from '../../../client/components/Cloud/Layout';
import { FileTable } from '../../../client/components/FileTable';
import Control from '../../../client/components/UI/Control/List';
import { useCloudReducer } from '../../../client/hooks/cloud';
import { IFile } from '../../../client/models/IFile';
import { RouteNames } from '../../../client/router';
import { filesAPI } from '../../../client/services/FilesService';
import { wrapper } from '../../../client/store';
import { clearSelected, selectFile, setContext, unselectFile } from '../../../client/store/reducers/CloudSlice';
import { setInitialUserData } from '../../../client/store/reducers/UserSlice';
import { getFilesPlaceholder, getLinks } from '../../../client/utils';
import { getFilesContextMenu, getFloatControls } from './index';

export default function Directory({ files, links }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { selected, marked, dispatch } = useCloudReducer();
	const router = useRouter();
	if (!files) files = getFilesPlaceholder();

	const floatControls = getFloatControls(selected, [Control.SHARE]);
	const headingOptions = {
		links,
		actions: [Control.CREATE],
		constControls: [Control.VIEW, Control.INFO],
		floatControls: floatControls,
		sticky: true
	};

	const contextMenu = [Control.CREATE, Control.NULL, Control.UPLOAD, Control.UPLOAD_FOLDER, Control.NULL, Control.SHARE, Control.NULL, Control.VIEW, Control.INFO];
	const filesContextMenu = getFilesContextMenu(selected);

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
					await router.push(`${RouteNames.FILES}/${encodeURIComponent(file.path)}`);
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
			title={links[links.length - 1].title}
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
	const path = ctx.query.directory?.toString() || '/';
	const links = getLinks(path);

	setInitialUserData(ctx, dispatch);
	dispatch(setContext({ url, path }));

	const { data: files } = await store.dispatch(filesAPI.endpoints.getFiles.initiate(path));

	return { props: { files: files || null, links } };
});