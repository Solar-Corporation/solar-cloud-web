import { LoadingOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useCloudReducer } from '../../hooks/cloud';
import { useAppSelector } from '../../hooks/redux';
import { IFile, IMove } from '../../models/IFile';
import { filesAPI } from '../../services/FilesService';
import { setIsModalOpen } from '../../store/reducers/ModalSlice';
import styles from '../../styles/components/Modal.module.less';
import { getIsDir } from '../../utils';
import { FileTable } from '../FileTable';
import { AppModal } from './index';

export const ModalMoveFile: FC = () => {
	const [length, setLength] = useState(0);
	const [isDir, setIsDir] = useState(false);
	const [index, setIndex] = useState(0);
	const [selected, setSelected] = useState<IFile[]>([]);
	const [folders, setFolders] = useState<{ name: string, hash: string }[]>([{ name: 'Все файлы', hash: '' }]);

	const { context, selected: globalSelected, dispatch } = useCloudReducer();
	const { moveFile: isOpen } = useAppSelector(state => state.modalReducer.modal);
	const [moveFile] = filesAPI.useMoveFileMutation();
	const [getFolders, { data: files, isLoading }] = filesAPI.useGetFoldersMutation();

	const handleUpdate = () => {
		if (globalSelected.length) {
			setFolders([{ name: 'Все файлы', hash: '' }]);
			setIndex(0);
			setSelected([]);
		}
	};

	const handleClose = () => {
		dispatch(setIsModalOpen({ moveFile: false }));
	};

	const handleSubmit = async () => {
		handleClose();

		const hashes: IMove[] = globalSelected.map((file) => ({
			hashFrom: file.hash,
			hashTo: selected.length ? selected[0].hash : folders[index].hash
		}));

		await moveFile({
			hashes,
			isDir,
			destination: selected.length ? selected[0].name : folders[index].name
		});
	};


	const handleBack = () => {
		setIndex(index => index - 1);
		folders.pop();
	};

	const handleClick = () => {
		setSelected([]);
	};

	const handleRowClick = (event: any, file: IFile, isSelected: boolean) => {
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
				folders.push({ name: file.name, hash: file.hash });
				setSelected([]);
				setIndex(index => index + 1);
				break;
			}
		}
	};

	useEffect(() => {
		handleUpdate();
		if (globalSelected.length) {
			setLength(globalSelected.length);
			setIsDir(getIsDir(globalSelected));
		}
	}, [globalSelected]);

	useEffect(() => {
		if (isOpen && !isLoading) {
			console.log(folders[index].hash);
			getFolders({
				hash: folders[index].hash,
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
			confirmDisabled={context.hash === (selected.length ? selected[0].hash : folders[index].hash || null)}
			onOk={handleSubmit}
			onCancel={handleClose}
			afterClose={handleUpdate}
			onContainerClick={handleClick}
		>
			<div>
				<div className={styles.selectHeader}>
					<div className={styles.title}>
						Место перемещения: {selected.length ? selected[0].name : folders[index].name}
					</div>
					{index > 0 &&
              <Button
                  type="ghost"
                  title="Вернуться обратно"
                  size="small"
                  icon={<RollbackOutlined/>}
                  disabled={isLoading}
                  onClick={handleBack}
              />}
				</div>
				<div className={styles.select}>
					{isLoading
						? <div className={styles.loading}><LoadingOutlined/></div>
						: files &&
              <FileTable
                  files={files}
                  className={styles.fileTable}
                  selected={selected}
                  onRowClick={handleRowClick}
                  empty={<div className={styles.empty}>Нет папок</div>}
                  disableHeader
                  disableColumns
              />}
				</div>
			</div>
		</AppModal>
	);
};