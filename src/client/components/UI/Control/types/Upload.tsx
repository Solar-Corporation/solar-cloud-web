import { FileAddOutlined, FolderAddOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { Control, ControlTypeProps } from '../index';
import { Upload } from 'antd';

interface ControlUploadProps extends ControlTypeProps {
	folder?: boolean;
}

export const ControlUpload: FC<ControlUploadProps> = ({ type, block, className, folder }) => {
	return (
		<Upload
			name={folder ? 'folder' : 'file'}
			fileList={[]}
			directory={folder}
			multiple={!folder}
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