import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { CloudLayout } from '../../client/components/Cloud/Layout';
import { Action } from '../../client/components/UI/Action/List';
import { Control } from '../../client/components/UI/Control/List';
import { RouteNames } from '../../client/router';
import { filesAPI } from '../../client/services/FilesService';
import { wrapper } from '../../client/store';
import { setInitialUserData } from '../../client/store/reducers/UserSlice';
import { FileTable } from '../../client/components/FileTable';

export default function Cloud({}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const files = [
		{
			name: 'test',
			path: '/test',
			size: '4.00 KiB',
			fileType: '',
			mimeType: 'text/plain',
			isDir: true,
			isFavorite: false,
			seeTime: 1673379696000
		},
		{
			name: 'Архив 1.zip',
			path: '/Архив 1.zip',
			size: '10 MiB',
			fileType: 'zip',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		},
		{
			name: 'Архив 1.rar',
			path: '/Архив 1.rar',
			size: '12 MiB',
			fileType: 'rar',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		},
		{
			name: 'Руководство пользователя.pdf',
			path: '/Руководство пользователя.pdf',
			size: '5.00 KiB',
			fileType: 'pdf',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		},
		{
			name: 'test123.txt',
			path: '/test123.txt',
			size: '7 B',
			fileType: 'txt',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		},
		{
			name: 'Старый вариант документа.doc',
			path: '/Старый вариант документа.doc',
			size: '10 B',
			fileType: 'doc',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		},
		{
			name: 'Новый вариант документа.docx',
			path: '/Новый вариант документа.docx',
			size: '10 B',
			fileType: 'doc',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		},
		{
			name: 'Таблица 1.xlsx',
			path: '/Таблица 1.xlsx',
			size: '10 B',
			fileType: 'xlsx',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		},
		{
			name: 'Презентация.pptx',
			path: '/Таблица 1.pptx',
			size: '10 B',
			fileType: 'pptx',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		},
		{
			name: 'test123.bsp',
			path: '/test123.bsp',
			size: '10 B',
			fileType: 'bsp',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
		},
		{
			name: 'Очень длинное, ну прям очень очень длинное, название для изображения, которое не должно поместиться в одну строчку.png',
			path: '/Очень длинное, ну прям очень очень длинное, название для изображения, которое не должно поместиться в одну строчку.png',
			size: '10 B',
			fileType: 'png',
			mimeType: 'text/plain',
			isDir: false,
			isFavorite: false,
			seeTime: 1673380864000
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