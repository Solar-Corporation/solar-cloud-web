export type FileTree = {
	name: string;
	path: string;
	isFolder: boolean;
	expand: boolean;
	children?: Array<FileTree>;
}
