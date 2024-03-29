import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { CloudLayout } from '../client/components/Cloud/Layout';
import { FileTable } from '../client/components/FileTable';
import { ResultEmptyMarked } from '../client/components/Result/EmptyMarked';
import Control from '../client/components/UI/Control/List';
import { useCloudReducer } from '../client/hooks/cloud';
import { IFile } from '../client/models/IFile';
import { RouteNames } from '../client/router';
import { privateRoute } from '../client/router/private';
import { filesAPI } from '../client/services/FilesService';
import { wrapper } from '../client/store';
import { clearSelected, selectFile, unselectFile } from '../client/store/reducers/CloudSlice';
import { setIsModalOpen } from '../client/store/reducers/ModalSlice';
import { setInitialData } from '../client/utils';

export const getFloatControls = (selected: IFile[]) => selected.length
	? selected.length > 1
		? [Control.DOWNLOAD, Control.DELETE]
		: [Control.SHARE, Control.DOWNLOAD, Control.DELETE, Control.RENAME, Control.MARK]
	: undefined;

export const getFilesContextMenu = (selected: IFile[]) => selected.length > 1
	? [Control.DOWNLOAD, Control.DELETE]
	: [Control.SHARE, Control.DOWNLOAD, Control.DELETE, Control.NULL, Control.RENAME, Control.MARK];

export default function Marked({ files, space }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { selected, marked, shared, dispatch } = useCloudReducer();
	const router = useRouter();

	const headingOptions = {
		links: [{ title: 'Избранное', href: RouteNames.MARKED }],
		constControls: files ? getFloatControls(selected) : undefined,
		sticky: true
	};

	const filesContextMenu = getFilesContextMenu(selected);

	const handleRowClick = async (event: any, file: IFile, isSelected: boolean) => {
		switch (event.detail) {
			case 1: {
				if (event.shiftKey) {
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
			title="Избранное"
			headingOptions={headingOptions}
			space={space}
		>
			<FileTable
				files={files}
				contextMenu={filesContextMenu}
				selected={selected}
				marked={marked}
				shared={shared}
				empty={<ResultEmptyMarked/>}
				onRowClick={handleRowClick}
				onRowContextMenu={handleRowContextMenu}
				showPath
			/>
		</CloudLayout>
	);
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(store => async ctx => {
	const { dispatch } = store;
	setInitialData(ctx, dispatch, null);
	const { data: files, error } = await dispatch(filesAPI.endpoints.getMarkedFiles.initiate());
	const { data: space } = await dispatch(filesAPI.endpoints.getSpace.initiate());

	return privateRoute({ files: files || null, space: space || null }, ctx, error, RouteNames.MARKED);
});