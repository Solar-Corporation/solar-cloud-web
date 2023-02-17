import { FileAddOutlined, FolderAddOutlined } from '@ant-design/icons';
import { Upload, UploadProps } from 'antd';
import { RcFile } from 'antd/es/upload';
import { FC, useEffect } from 'react';
import { useAppSelector } from '../../../../hooks/redux';
import { IUpload } from '../../../../models/IUpload';
import { filesAPI } from '../../../../services/FilesService';
import { Control, ControlTypeProps } from '../index';

interface ControlUploadProps extends ControlTypeProps {
	folder?: boolean;
}

export const ControlUpload: FC<ControlUploadProps> = ({ type, block, className, folder }) => {
	const { path } = useAppSelector(state => state.cloudReducer.context);
	const [uploadFiles, { data, error }] = filesAPI.useUploadFilesMutation();

	const handleUpload: UploadProps['beforeUpload'] = (file, fileList) => {
		const formData = new FormData();

		fileList.forEach((file) => {
			formData.append('files[]', file as RcFile);
		});

		const upload: IUpload = {
			path,
			formData
		};

		uploadFiles(upload);

		return false;
	};

	useEffect(() => {
		if (data) console.log('data', data);
		if (error) console.log('error', error);
	}, [data, error]);

	return (
		<Upload
			name={folder ? 'folder' : 'file'}
			fileList={[]}
			directory={folder}
			multiple={!folder}
			beforeUpload={handleUpload}
		>
			<Control
				icon={folder ? <FolderAddOutlined/> : <FileAddOutlined/>}
				title={folder ? 'Загрузить папку' : 'Загрузить файлы'}
				className={className}
				type={type}
				block={block}
				disablePropagation
			/>
		</Upload>
	);
};