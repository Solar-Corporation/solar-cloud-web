import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { CloudLayout } from '../../client/components/Cloud/Layout';
import { FileTable } from '../../client/components/FileTable';
import { ResultEmpty } from '../../client/components/Result/Empty';
import Control from '../../client/components/UI/Control/List';
import { useCloudReducer } from '../../client/hooks/cloud';
import { IFile } from '../../client/models/IFile';
import { RouteNames } from '../../client/router';
import { privateRoute } from '../../client/router/private';
import { filesAPI } from '../../client/services/FilesService';
import { wrapper } from '../../client/store';
import { clearSelected, selectFile, setDirectory, unselectFile } from '../../client/store/reducers/CloudSlice';
import { setIsModalOpen } from '../../client/store/reducers/ModalSlice';
import { getDirectoryLinks, setInitialData } from '../../client/utils';
import { getFilesContextMenu, getFloatControls } from './index';

export default function Directory({
	                                  files,
	                                  links,
	                                  space,
	                                  name
                                  }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { selected, marked, shared, dispatch } = useCloudReducer();
	const router = useRouter();

	const floatControls = getFloatControls(selected, [Control.SHARE, Control.DOWNLOAD]);
	const headingOptions = {
		links,
		actions: files ? [Control.CREATE] : undefined,
		constControls: files ? [Control.INFO] : undefined,
		floatControls: files ? floatControls : undefined,
		sticky: true
	};

	const contextMenu = files
		? [Control.CREATE, Control.NULL, Control.UPLOAD, Control.UPLOAD_FOLDER, Control.NULL, Control.SHARE, Control.DOWNLOAD, Control.NULL, Control.VIEW, Control.INFO]
		: undefined;
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
					await router.push(`${RouteNames.FILES}/${file.hash}`);
				} else {
					dispatch(setIsModalOpen({ previewFile: true }));
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
			title={name}
			headingOptions={headingOptions}
			contextMenu={contextMenu}
			space={space}
		>
			<FileTable
				files={files}
				contextMenu={filesContextMenu}
				selected={selected}
				marked={marked}
				shared={shared}
				empty={<ResultEmpty folderName={name}/>}
				onRowClick={handleRowClick}
				onRowContextMenu={handleRowContextMenu}
			/>
		</CloudLayout>
	);
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(store => async ctx => {
	const { dispatch } = store;
	const hash = ctx.query.directory?.toString() || '';
	setInitialData(ctx, dispatch, hash || null);
	const { data: files, error } = await dispatch(filesAPI.endpoints.getFiles.initiate(hash));
	const { data: paths } = await dispatch(filesAPI.endpoints.getFolderPath.initiate(hash));
	const { data: space } = await dispatch(filesAPI.endpoints.getSpace.initiate());
	dispatch(setDirectory([
		paths ? paths[paths.length - 1].isShare || false : false,
		paths ? paths[paths.length - 1].name || '' : ''
	]));

	return privateRoute(
		{
			files: files || null,
			links: getDirectoryLinks(paths),
			space: space || null,
			name: paths ? paths[paths.length - 1].name : ''
		},
		error
	);
});