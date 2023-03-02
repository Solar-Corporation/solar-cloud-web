import { LoadingOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useCloudReducer } from '../../hooks/cloud';
import { useAppSelector } from '../../hooks/redux';
import { IFile, IMove } from '../../models/IFile';
import { filesAPI } from '../../services/FilesService';
import { setIsModalOpen } from '../../store/reducers/ModalSlice';
import { getIsDir, getLinks } from '../../utils';
import { FileTable } from '../FileTable';
import { AppModal } from './index';
import styles from '../../styles/components/Modal.module.less';

export const ModalMoveFile: FC = () => {
	const [length, setLength] = useState(0);
	const [isDir, setIsDir] = useState(false);
	const [index, setIndex] = useState(0);
	const [selected, setSelected] = useState<IFile[]>([]);
	const [path, setPath] = useState(['/']);

	const { context, selected: globalSelected, dispatch } = useCloudReducer();
	const { moveFile: isOpen } = useAppSelector(state => state.modalReducer.modal);
	const [moveFile, { isLoading }] = filesAPI.useMoveFileMutation();
	const [getFolders, { data: files, isLoading: isLoadingQuery }] = filesAPI.useGetFoldersMutation();

	const handleSubmit = async () => {
		const paths: IMove[] = globalSelected.map((file) => ({
			pathFrom: file.path,
			pathTo: selected.length
				? selected[0].path
				: path[index]
		}));
		console.log(paths);

		await moveFile({ paths, isDir, destination: selected.length ? selected[0].name : getLinks(path[index])[index].title });
	};

	const handleClose = () => {
		dispatch(setIsModalOpen({ moveFile: false }));
	};

	const handleUpdate = () => {
		if (globalSelected.length) {
			if (!isLoading) {
				setPath(['/']);
				setIndex(0);
				setSelected([]);
			}
		}
	};

	const handleBack = () => {
		setIndex(index => index - 1);
		path.pop();
	};

	const handleClick = () => {
		if (!isLoading) {
			setSelected([]);
		}
	};

	const handleRowClick = (event: any, file: IFile, isSelected: boolean) => {
		if (!isLoading) {
			switch (event.detail) {
				case 1: {
					if (isSelected) {
						setSelected([]);
					} else {
						setSelected([file]);
					}
					break;
				}
				case 2: {
					path.push(file.path);
					setSelected([]);
					setIndex(index => index + 1);
					break;
				}
			}
		}
	};

	useEffect(() => {
		handleUpdate();
		if (globalSelected.length) {
			if (!isLoading) {
				setLength(globalSelected.length);
				setIsDir(getIsDir(globalSelected));
			}
		}
	}, [globalSelected]);

	useEffect(() => {
		if (isOpen && (!isLoading || !isLoadingQuery)) {
			getFolders({
				path: path[index],
				filesPath: globalSelected.filter(file => file.isDir).map(file => file.path)
			});
		}
	}, [isOpen, index]);

	return (
		<AppModal
			title={length > 1
				? isDir ? 'Переместить папки' : 'Переместить файлы'
				: isDir ? 'Переместить папку' : 'Переместить файл'
			}
			okText="Переместить"
			open={isOpen}
			confirmLoading={isLoading}
			confirmDisabled={context.path === (selected.length ? selected[0].path : path[index])}
			onOk={handleSubmit}
			onCancel={handleClose}
			afterClose={handleUpdate}
			onContainerClick={handleClick}
		>
			<div>
				<div className={styles.selectHeader}>
					<div className={styles.title}>Место перемещения: {selected.length ? selected[0].name :getLinks(path[index])[index].title}</div>
					{index > 0 &&
						<Button
		          type="ghost"
		          title="Вернуться обратно"
              size="small"
              icon={<RollbackOutlined />}
              disabled={isLoading || isLoadingQuery}
              onClick={handleBack}
            />}
				</div>
				<div className={styles.select}>
					{isLoadingQuery
						? <div className={styles.loading}><LoadingOutlined/></div>
						: files &&
              <FileTable
                files={files}
                className={styles.fileTable}
                selected={selected}
                onRowClick={handleRowClick}
                disableHeader
                disableColumns
              />}
				</div>
			</div>
		</AppModal>
	);
};