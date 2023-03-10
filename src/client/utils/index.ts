import Router from 'next/router';
import { IFile } from '../models/IFile';
import { RouteNames } from '../router';

export const getDateStr = (date: Date) => {
	const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
	const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
	const year = date.getFullYear();

	const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
	const minutes = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;

	return `${day}.${month}.${year} ${hours}:${minutes}`;
};

export const pxToNumber = (str: string) => {
	return Number(str.replace(/px/g, ''));
};

export const refreshPage = async () => {
	await Router.replace(Router.asPath);
};

export const getLinks = (str: string) => {
	const links: { title: string, href: string }[] = [{ title: 'Все файлы', href: RouteNames.CLOUD }];

	if (str !== '/') {
		const arrFromString = str.split('/');
		for (let i = 1; i < arrFromString.length; i++) {
			if (i === 1) {
				links.push({ title: arrFromString[1], href: `${RouteNames.CLOUD}?path=/${arrFromString[1]}` });
			} else {
				links.push({ title: arrFromString[i], href: `${links[i - 1].href}/${arrFromString[i]}` });
			}
		}
	}

	return links;
};

export const getFilesPlaceholder = () => [
	{
		name: 'test',
		path: '/test',
		size: '—',
		fileType: '',
		mimeType: 'text/plain',
		isDir: true,
		isFavorite: false,
		seeTime: 1673379696000
	}, {
		name: 'Очень длинное, ну прям очень очень длинное, название для папки, которое не должно поместиться в одну строчку',
		path: '/Очень длинное, ну прям очень очень длинное, название для папки, которое не должно поместиться в одну строчку',
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
	}
];

export const getIsDir = (arr: IFile[]) => arr.length === arr.filter(file => file.isDir).length;

export const getHasDir = (arr: IFile[]) => !!arr.find(file => file.isDir);

// export async function hash(string) {
//   const utf8 = new TextEncoder().encode(string);
//   const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
//   return hashArray
//     .map((bytes) => bytes.toString(16).padStart(2, "0"))
//     .join("");
// }