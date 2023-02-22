export interface IFile {
	name: string;
	path: string;
	size: string;
	fileType: string;
	isDir: boolean;
	isFavorite: boolean;
	mimeType?: string;
	seeTime?: number;
}

export interface IDirectory {
	path: string;
	name: string;
}