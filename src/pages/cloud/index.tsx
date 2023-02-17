import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { CloudLayout } from '../../client/components/Cloud/Layout';
import { FileTable } from '../../client/components/FileTable';
import Control from '../../client/components/UI/Control/List';
import { useAppSelector } from '../../client/hooks/redux';
import { filesAPI } from '../../client/services/FilesService';
import { wrapper } from '../../client/store';
import { setContext } from '../../client/store/reducers/CloudSlice';
import { setInitialUserData } from '../../client/store/reducers/UserSlice';
import { getLinks } from '../../client/utils';

export default function Cloud({ files, path, links }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { selected } = useAppSelector(state => state.cloudReducer);

	if (!files) {
		files = [{
			name: 'test',
			path: '/test',
			size: '—',
			fileType: '',
			mimeType: 'text/plain',
			isDir: true,
			isFavorite: false,
			seeTime: 1673379696000
		}, {
			name: 'Архив 1.zip',
			path: '/Архив 1.zip',
			size: '10 MiB',
			fileType: 'zip',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		}, {
			name: 'Архив 1.rar',
			path: '/Архив 1.rar',
			size: '12 MiB',
			fileType: 'rar',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		}, {
			name: 'Руководство пользователя.pdf',
			path: '/Руководство пользователя.pdf',
			size: '5.00 KiB',
			fileType: 'pdf',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		}, {
			name: 'test123.txt',
			path: '/test123.txt',
			size: '7 B',
			fileType: 'txt',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		}, {
			name: 'Старый вариант документа.doc',
			path: '/Старый вариант документа.doc',
			size: '10 B',
			fileType: 'doc',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		}, {
			name: 'Новый вариант документа.docx',
			path: '/Новый вариант документа.docx',
			size: '10 B',
			fileType: 'doc',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		}, {
			name: 'Таблица 1.xlsx',
			path: '/Таблица 1.xlsx',
			size: '10 B',
			fileType: 'xlsx',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		}, {
			name: 'Презентация.pptx',
			path: '/Таблица 1.pptx',
			size: '10 B',
			fileType: 'pptx',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		}, {
			name: 'test123.bsp',
			path: '/test123.bsp',
			size: '10 B',
			fileType: 'bsp',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		}, {
			name: 'Очень длинное, ну прям очень очень длинное, название для изображения, которое не должно поместиться в одну строчку.png',
			path: '/Очень длинное, ну прям очень очень длинное, название для изображения, которое не должно поместиться в одну строчку.png',
			size: '10 B',
			fileType: 'png',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		}];
	}

	const headingOptions = {
		links,
		actions: [Control.CREATE],
		constControls: [Control.VIEW, Control.INFO],
		floatControls:
			selected.length
				? selected.length > 1
					? [Control.SHARE, Control.DOWNLOAD, Control.DELETE, Control.MOVE, Control.COPY]
					: [Control.SHARE, Control.DOWNLOAD, Control.DELETE, Control.RENAME, Control.MOVE, Control.COPY, Control.MARK]
				: path !== '/' ? [Control.SHARE] : undefined,
		sticky: true
	};

	const contextMenu = path !== '/'
		? [Control.CREATE, Control.NULL, Control.UPLOAD, Control.UPLOAD_FOLDER, Control.NULL, Control.SHARE, Control.VIEW, Control.INFO]
		: [Control.CREATE, Control.NULL, Control.UPLOAD, Control.UPLOAD_FOLDER, Control.NULL, Control.VIEW, Control.INFO];
	const contextMenuFiles = selected.length > 1
		? [Control.SHARE, Control.DOWNLOAD, Control.DELETE, Control.NULL, Control.MOVE, Control.COPY, Control.NULL, Control.INFO]
		: [Control.SHARE, Control.DOWNLOAD, Control.DELETE, Control.NULL, Control.RENAME, Control.MOVE, Control.COPY, Control.MARK, Control.NULL, Control.INFO];

	return (
		<CloudLayout
			title="Все файлы"
			headingOptions={headingOptions}
			contextMenu={contextMenu}
		>
			{files && <FileTable files={files} contextMenu={contextMenuFiles} />}
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