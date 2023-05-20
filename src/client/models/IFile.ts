import { RcFile } from 'antd/es/upload';

export interface IFile {
	name: string;
	hash: string;
	path: string;
	size: string;
	fileType: string;
	isDir: boolean;
	isDelete: boolean;
	isFavorite: boolean;
	isShare?: boolean;
	mimeType: string;
	updateAt: string | null;
	deleteAt: string | null;
}

export interface IDirectory {
	hash: string | null;
	name: string;
}

export interface IUpload {
	files: RcFile[];
	hash?: string;
	dir?: string;
}

export interface IMove {
	hashFrom: string | null;
	hashTo: string | null;
}

export interface IStorageSpace {
	percent: number;
	totalSpace: string;
	usageSpace: string;
}