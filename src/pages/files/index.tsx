import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { CloudLayout } from '../../client/components/Cloud/Layout';
import { FileTable } from '../../client/components/FileTable';
import Control from '../../client/components/UI/Control/List';
import { useCloudReducer } from '../../client/hooks/cloud';
import { IFile } from '../../client/models/IFile';
import { RouteNames } from '../../client/router';
import { privateRoute } from '../../client/router/private';
import { filesAPI } from '../../client/services/FilesService';
import { wrapper } from '../../client/store';
import { clearSelected, selectFile, unselectFile } from '../../client/store/reducers/CloudSlice';
import { setIsModalOpen } from '../../client/store/reducers/ModalSlice';
import { getDirectoryLinks, setInitialData } from '../../client/utils';

export const getFloatControls = (selected: IFile[], initial?: Control[]) => selected.length
	? selected.length > 1
		? [Control.DOWNLOAD, Control.DELETE, Control.MOVE, Control.COPY]
		: [Control.SHARE, Control.DOWNLOAD, Control.DELETE, Control.RENAME, Control.MOVE, Control.COPY, Control.MARK]
	: initial;

export const getFilesContextMenu = (selected: IFile[]) => selected.length > 1
	? [Control.DOWNLOAD, Control.DELETE, Control.NULL, Control.MOVE, Control.COPY, Control.NULL, Control.INFO]
	: [Control.SHARE, Control.DOWNLOAD, Control.DELETE, Control.NULL, Control.RENAME, Control.MOVE, Control.COPY, Control.MARK, Control.NULL, Control.INFO];

export default function Files({ files, links, space }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { selected, marked, shared, dispatch } = useCloudReducer();
	const router = useRouter();

	const floatControls = getFloatControls(selected);
	const headingOptions = {
		links,
		actions: files ? [Control.CREATE] : undefined,
		constControls: files ? [Control.INFO] : undefined,
		floatControls,
		sticky: true
	};

	const contextMenu = files
		? [Control.CREATE, Control.NULL, Control.UPLOAD, Control.UPLOAD_FOLDER, Control.NULL, Control.VIEW, Control.INFO]
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
			title="Все файлы"
			headingOptions={headingOptions}
			space={space}
			contextMenu={contextMenu}
		>
			<FileTable
				files={files}
				contextMenu={filesContextMenu}
				selected={selected}
				marked={marked}
				shared={shared}
				onRowClick={handleRowClick}
				onRowContextMenu={handleRowContextMenu}
			/>
		</CloudLayout>
	);
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(store => async ctx => {
	const { dispatch } = store;
	setInitialData(ctx, dispatch, null);
	const { data: files, error } = await dispatch(filesAPI.endpoints.getFiles.initiate());
	const { data: space } = await dispatch(filesAPI.endpoints.getSpace.initiate());

	return privateRoute({ files: files || null, links: getDirectoryLinks(), space: space || null }, ctx, error);
});