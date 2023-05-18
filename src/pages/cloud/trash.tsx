import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { CloudLayout } from '../../client/components/Cloud/Layout';
import { FileTable } from '../../client/components/FileTable';
import { ResultEmptyTrash } from '../../client/components/Result/EmptyTrash';
import Control from '../../client/components/UI/Control/List';
import { useCloudReducer } from '../../client/hooks/cloud';
import { IFile } from '../../client/models/IFile';
import { RouteNames } from '../../client/router';
import { filesAPI } from '../../client/services/FilesService';
import { wrapper } from '../../client/store';
import { clearSelected, selectFile, unselectFile } from '../../client/store/reducers/CloudSlice';
import { setInitialUserData } from '../../client/store/reducers/UserSlice';

export default function Trash({ files }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { selected, marked, dispatch } = useCloudReducer();

	const floatControls = selected.length
		? [Control.RECOVER, Control.CLEAR_FILE]
		: [Control.CLEAR];

	const headingOptions = {
		links: [{ title: 'Корзина', href: RouteNames.TRASH }],
		constControls: [Control.VIEW, Control.INFO],
		floatControls: floatControls,
		sticky: true
	};

	const filesContextMenu = [Control.RECOVER, Control.CLEAR_FILE, Control.NULL, Control.INFO];

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
				console.log('double click!');
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
			title="Корзина"
			headingOptions={headingOptions}
		>
			<FileTable
				files={files}
				contextMenu={filesContextMenu}
				selected={selected}
				marked={marked}
				empty={<ResultEmptyTrash />}
				onRowClick={handleRowClick}
				onRowContextMenu={handleRowContextMenu}
			/>
		</CloudLayout>
	);
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(store => async ctx => {
	const { dispatch } = store;
	setInitialUserData(ctx, dispatch);
	const { data: files, error } = await store.dispatch(filesAPI.endpoints.getTrashFiles.initiate());

	// @ts-ignore
	if (error && error.status === 401) return {
		redirect: {
			permanent: true,
			destination: `${RouteNames.LOGIN}?return_to=${RouteNames.TRASH}`
		}
	};
	return { props: { files: files || null } };
});