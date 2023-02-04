import { FC, useEffect, useState } from 'react';
import { IFile } from '../../models/IFile';
import {
	FileExcelFilled,
	FileImageFilled,
	FilePdfFilled,
	FilePptFilled,
	FileTextFilled,
	FileUnknownFilled,
	FileWordFilled,
	FileZipFilled,
	FolderFilled
} from '@ant-design/icons';
import styles from '../../styles/components/FileTable.module.less';
import { FileTableColumn } from './Column';
import { getDateStr } from '../../utils';
import { RouteNames } from '../../router';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { clearSelected, selectFile, unselectFile } from '../../store/reducers/CloudSlice';

enum Extension {
	UNKNOWN = 'Файл',
	FOLDER = 'Папка с файлами',
	EXCEL = 'Таблица Excel',
	IMAGE = 'Изображение',
	PDF = 'Документ PDF',
	PPT = 'Презентация PowerPoint',
	TEXT = 'Текстовый документ',
	WORD = 'Документ Word',
	ZIP = 'Архив'
}

interface FileTableRowProps {
	file: IFile;
}

export const FileTableRow: FC<FileTableRowProps> = ({ file }) => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { selected } = useAppSelector(state => state.cloudReducer);
	const [isSelected, setIsSelected] = useState<boolean>(!!selected.find(selectedFile => selectedFile.path === file.path));
	const date = new Date(file.seeTime || '');
	let icon;
	let extension;

	if (file.isDir) {
		icon = <FolderFilled className={styles.iconFolder} />;
		extension = Extension.FOLDER;
	} else {
		switch (file.fileType) {
			case 'doc':
			case 'docx':
				icon = <FileWordFilled className={styles.iconWord} />;
				extension = Extension.WORD;
				break;
			case 'jpg':
			case 'jpeg':
			case 'png':
			case 'svg':
			case 'bmp':
			case 'raw':
			case 'tiff':
			case 'gif':
			case 'jp2':
				icon = <FileImageFilled className={styles.iconImage} />;
				extension = `${Extension.IMAGE} ${file.fileType.toUpperCase()}`;
				break;
			case 'pdf':
				icon = <FilePdfFilled className={styles.iconPdf} />;
				extension = Extension.PDF;
				break;
			case 'ppt':
			case 'pptx':
				icon = <FilePptFilled className={styles.iconPpt} />;
				extension = Extension.PPT;
				break;
			case 'txt':
				icon = <FileTextFilled className={styles.iconText} />;
				extension = Extension.TEXT;
				break;
			case 'xls':
			case 'xlsx':
				icon = <FileExcelFilled className={styles.iconExcel} />;
				extension = Extension.EXCEL;
				break;
			case 'zip':
			case 'rar':
				icon = <FileZipFilled className={styles.iconZip} />;
				extension = `${Extension.ZIP} ${file.fileType.toUpperCase()}`;
				break;
			default:
				icon = <FileUnknownFilled className={styles.iconUnknown} />;
				extension = `${Extension.UNKNOWN} "${file.fileType.toUpperCase()}"`;
		}
	}

	useEffect(() => {
		setIsSelected(!!selected.find(selectedFile => selectedFile.path === file.path));
	}, [selected]);

	const handleClick = async (event: any) => {
		event.stopPropagation();
		switch (event.detail) {
			case 1: {
				if (event.ctrlKey) {
					if (!isSelected) {
						dispatch(selectFile(file));
					} else {
						dispatch(unselectFile(file));
					}
				} else {
					dispatch(clearSelected());
					dispatch(selectFile(file));
				}
				break;
			}
			case 2: {
				if (file.isDir) {
					await router.push(`${RouteNames.CLOUD}?path=${file.path}`);
				} else {
					console.log('double click!');
				}
				break;
			}
			default:
				break;
		}
	};

	return (
		<div
			className={isSelected ? `${styles.selected} ${styles.row}` : styles.row}
			onClick={event => handleClick(event)}
		>
			<FileTableColumn title={file.name}>
				<div className={styles.name}>
					<span className={styles.icon}>{icon}</span>
					<span className={styles.nameText}>{file.name}</span>
				</div>
			</FileTableColumn>
			<div className={styles.columns}>
				{file.hasOwnProperty('fileType') &&
        <FileTableColumn title={extension} className={styles.extension}>{extension}</FileTableColumn>}
				{file.hasOwnProperty('seeTime') &&
        <FileTableColumn className={styles.date}>{getDateStr(date)}</FileTableColumn>}
				{file.hasOwnProperty('size') && <FileTableColumn className={styles.size}>{file.size}</FileTableColumn>}
			</div>
		</div>
	);
};