export interface IFile {
	name: string;
	path: string;
	fileType: string;
	isDir: boolean;
	isFavorite: boolean;
	mimeType?: string;
	seeTime?: number;
}