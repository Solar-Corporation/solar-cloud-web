import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { CloudLayout } from '../client/components/Cloud/Layout';
import { FileTable } from '../client/components/FileTable';
import { ResultEmptySearch } from '../client/components/Result/EmptySearch';
import { useCloudReducer } from '../client/hooks/cloud';
import { IFile } from '../client/models/IFile';
import { RouteNames } from '../client/router';
import { privateRoute } from '../client/router/private';
import { filesAPI } from '../client/services/FilesService';
import { wrapper } from '../client/store';
import { clearSelected, selectFile, unselectFile } from '../client/store/reducers/CloudSlice';
import { setIsModalOpen } from '../client/store/reducers/ModalSlice';
import { getDirectoryLinks, setInitialData } from '../client/utils';
import { getFloatControls, getFilesContextMenu } from './marked';

export default function Search({ files, space, search }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { selected, marked, shared, dispatch } = useCloudReducer();

	const headingOptions = {
		links: [{ title: 'Поиск', href: RouteNames.SEARCH }],
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
				if (!file.isDir) dispatch(setIsModalOpen({ previewFile: true }));
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
			title="Поиск"
			headingOptions={headingOptions}
			space={space}
		>
			<FileTable
				files={files}
				contextMenu={filesContextMenu}
				selected={selected}
				marked={marked}
				shared={shared}
				empty={<ResultEmptySearch search={search}/>}
				onRowClick={handleRowClick}
				onRowContextMenu={handleRowContextMenu}
				showPath
			/>
		</CloudLayout>
	);
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(store => async ctx => {
	const { dispatch } = store;
	const name = ctx.query.name?.toString() || '';
	setInitialData(ctx, dispatch, null, name);
	const { data: files, error } = await dispatch(filesAPI.endpoints.getSearchFiles.initiate(name));
	const { data: space } = await dispatch(filesAPI.endpoints.getSpace.initiate());

	return privateRoute({ files: files || null, links: getDirectoryLinks(), space: space || null }, ctx, error);
});