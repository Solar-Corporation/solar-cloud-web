import { FileAddOutlined, FolderAddOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';
import { FC, useRef } from 'react';
import { useAppSelector } from '../../../../hooks/redux';
import { IDirectory, IUpload } from '../../../../models/IFile';
import { filesAPI } from '../../../../services/FilesService';
import { Control, ControlTypeProps } from '../index';
import styles from '../../../../styles/components/Control.module.less';

interface ControlUploadProps extends ControlTypeProps {
	folder?: boolean;
}

export const ControlUpload: FC<ControlUploadProps> = ({ type, block, className, folder }) => {
	const inputRef = useRef(null);
	const { path } = useAppSelector(state => state.cloudReducer.context);
	const [uploadFiles] = filesAPI.useUploadFilesMutation();
	const [uploadFolder] = filesAPI.useUploadDirectoryMutation();

	const handleClick = () => {
		// @ts-ignore
		inputRef.current.click();
	};

	const handleUpload = async (event: any) => {
		const files: RcFile[] = Array.prototype.slice.call(event.currentTarget.files);

		if (files.length) {
			if (folder) {
				const name = event.target.files[0].webkitRelativePath.split('/')[0];
				const directory: IDirectory = { path, name };
				await uploadFolder({ directory, files });
			} else {
				const upload: IUpload = { path, files };
				await uploadFiles(upload);
			}
		}
	};

	return (
		<span className={styles.upload}>
			<input
				ref={inputRef}
				name={folder ? 'folder' : 'file'}
				type="file"
				multiple={!folder}
				onChange={handleUpload}
				// @ts-ignore
				webkitdirectory={folder ? 'webkitDirectory' : undefined}
			/>
			<Control
				icon={folder ? <FolderAddOutlined/> : <FileAddOutlined/>}
				title={folder ? 'Загрузить папку' : 'Загрузить файлы'}
				className={className}
				type={type}
				block={block}
				onClick={handleClick}
			/>
		</span>
	);
};