import { RcFile } from 'antd/es/upload';

export interface IFile {
	name: string;
	path: string;
	size: string;
	fileType: string;
	isDir: boolean;
	isFavorite: boolean;
	isShared?: boolean;
	mimeType?: string;
	seeTime?: number;
}

export interface IDirectory {
	path: string;
	name: string;
}

export interface IUpload {
	path: string;
	files: RcFile[];
}

export interface IMove {
	pathFrom: string;
	pathTo: string;
}