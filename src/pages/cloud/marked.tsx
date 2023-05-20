import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { CloudLayout } from '../../client/components/Cloud/Layout';
import { FileTable } from '../../client/components/FileTable';
import { ResultEmptyMarked } from '../../client/components/Result/EmptyMarked';
import Control from '../../client/components/UI/Control/List';
import { useCloudReducer } from '../../client/hooks/cloud';
import { IFile } from '../../client/models/IFile';
import { RouteNames } from '../../client/router';
import { filesAPI } from '../../client/services/FilesService';
import { wrapper } from '../../client/store';
import { clearSelected, selectFile, unselectFile } from '../../client/store/reducers/CloudSlice';
import { setInitialUserData } from '../../client/store/reducers/UserSlice';
import { getFilesContextMenu, getFloatControls } from './files';

export default function Marked({ files, space }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { selected, marked, dispatch } = useCloudReducer();
	const router = useRouter();

	const floatControls = getFloatControls(selected);
	const headingOptions = {
		links: [{ title: 'Избранное', href: RouteNames.MARKED }],
		constControls: [Control.VIEW, Control.INFO],
		floatControls: floatControls,
		sticky: true
	};

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
			title="Избранное"
			headingOptions={headingOptions}
			space={space}
		>
			<FileTable
				files={files}
				contextMenu={filesContextMenu}
				selected={selected}
				marked={marked}
				empty={<ResultEmptyMarked/>}
				onRowClick={handleRowClick}
				onRowContextMenu={handleRowContextMenu}
			/>
		</CloudLayout>
	);
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(store => async ctx => {
	const { dispatch } = store;
	setInitialUserData(ctx, dispatch);
	const { data: files, error } = await dispatch(filesAPI.endpoints.getMarkedFiles.initiate());
	const { data: space } = await dispatch(filesAPI.endpoints.getSpace.initiate());

	// @ts-ignore
	if (error && error.status === 401) return {
		redirect: {
			permanent: true,
			destination: `${RouteNames.LOGIN}?return_to=${RouteNames.MARKED}`
		}
	};
	return { props: { files: files || null, space: space || null } };
});