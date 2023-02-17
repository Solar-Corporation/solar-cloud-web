import { FileAddOutlined, FolderAddOutlined } from '@ant-design/icons';
import { Upload, UploadProps } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useAppSelector } from '../../../../hooks/redux';
import { filesAPI } from '../../../../services/FilesService';
import { Control, ControlTypeProps } from '../index';

interface ControlUploadProps extends ControlTypeProps {
	folder?: boolean;
}

export const ControlUpload: FC<ControlUploadProps> = ({ type, block, className, folder }) => {
	const router = useRouter();
	const { path } = useAppSelector(state => state.cloudReducer.context);
	const [uploadFiles] = filesAPI.useUploadFilesMutation();

	const handleUpload: UploadProps['beforeUpload'] = async (file, fileList) => {
		const formData = new FormData();

		fileList.forEach((file) => {
			formData.append('files[]', file as RcFile);
		});
		formData.append('path', path);

		await uploadFiles(formData).finally(() => {
			router.replace(router.asPath);
		});

		return false;
	};

	return (
		<Upload
			name={folder ? 'folder' : 'file'}
			fileList={[]}
			directory={folder}
			multiple={!folder}
			beforeUpload={handleUpload}
		>
			<Control
				icon={folder ? <FolderAddOutlined /> : <FileAddOutlined />}
				title={folder ? 'Загрузить папку' : 'Загрузить файлы'}
				className={className}
				type={type}
				block={block}
				disablePropagation
			/>
		</Upload>
	);
};