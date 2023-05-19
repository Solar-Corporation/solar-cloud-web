import { ButtonProps } from 'antd';
import { FC } from 'react';
import { ControlAccept } from './types/Accept';
import { ControlClear } from './types/Clear';
import { ControlCopy } from './types/Copy';
import { ControlCopyLink } from './types/CopyLink';
import { ControlCreate } from './types/Create';
import { ControlDelete } from './types/Delete';
import { ControlDeleteLink } from './types/DeleteLink';
import { ControlDownload } from './types/Download';
import { ControlInfo } from './types/Info';
import { ControlLogout } from './types/Logout';
import { ControlMark } from './types/Mark';
import { ControlMore } from './types/More';
import { ControlMove } from './types/Move';
import { ControlRecover } from './types/Recover';
import { ControlRename } from './types/Rename';
import { ControlShare } from './types/Share';
import { ControlUpload } from './types/Upload';
import { ControlView } from './types/View';

enum Control {
	NULL,
	CREATE,
	UPLOAD,
	UPLOAD_FOLDER,
	INFO,
	VIEW,
	SHARE,
	DOWNLOAD,
	DELETE,
	DELETE_USER,
	DELETE_LINK,
	RENAME,
	MOVE,
	COPY,
	COPY_LINK,
	MARK,
	CLEAR,
	CLEAR_FILE,
	RECOVER,
	LOGOUT,
	ACCEPT,
	DECLINE
}

interface ControlListProps {
	list: Control[];
	type?: ButtonProps['type'];
	className?: string;
}

export const getControlType = (type: Control, index: number, buttonType?: ButtonProps['type'], block?: boolean, className?: string) => {
	return [
		type === Control.CREATE &&
    <ControlCreate key={index} type={buttonType} block={block} className={className}/>,
		type === Control.UPLOAD &&
    <ControlUpload key={index} type={buttonType} block={block} className={className}/>,
		type === Control.UPLOAD_FOLDER &&
    <ControlUpload key={index} type={buttonType} block={block} className={className} folder/>,
		type === Control.INFO &&
    <ControlInfo key={index} type={buttonType} block={block} className={className}/>,
		type === Control.VIEW &&
    <ControlView key={index} type={buttonType} block={block} className={className}/>,
		type === Control.SHARE &&
    <ControlShare key={index} type={buttonType} block={block} className={className}/>,
		type === Control.DOWNLOAD &&
    <ControlDownload key={index} type={buttonType} block={block} className={className}/>,
		type === Control.DELETE &&
    <ControlDelete key={index} type={buttonType} block={block} className={className}/>,
		type === Control.DELETE_USER &&
    <ControlDelete key={index} type={buttonType} block={block} className={className} user/>,
		type === Control.DELETE_LINK &&
		<ControlDeleteLink key={index} type={buttonType} block={block} className={className}/>,
		type === Control.RENAME &&
    <ControlRename key={index} type={buttonType} block={block} className={className}/>,
		type === Control.MOVE &&
    <ControlMove key={index} type={buttonType} block={block} className={className}/>,
		type === Control.COPY &&
    <ControlCopy key={index} type={buttonType} block={block} className={className}/>,
		type === Control.COPY_LINK &&
		<ControlCopyLink key={index} type={buttonType} block={block} className={className} />,
		type === Control.MARK &&
    <ControlMark key={index} type={buttonType} block={block} className={className}/>,
		type === Control.CLEAR &&
    <ControlClear key={index} type={buttonType} block={block} className={className}/>,
		type === Control.CLEAR_FILE &&
    <ControlClear key={index} type={buttonType} block={block} className={className} file/>,
		type === Control.RECOVER &&
    <ControlRecover key={index} type={buttonType} block={block} className={className}/>,
		type === Control.LOGOUT &&
		<ControlLogout key={index} type={buttonType} block={block} className={className}/>,
		type === Control.ACCEPT &&
    <ControlAccept key={index} type={buttonType} block={block} className={className}/>,
		type === Control.DECLINE &&
    <ControlAccept key={index} type={buttonType} block={block} className={className} decline/>,
	];
};

export const ControlList: FC<ControlListProps> = ({ list, type, className }) => {
	return (
		<>
			{list.length > 4
				? list.filter((control, index) => index < 3).map((control, index) => getControlType(control, index, type, false, className))
				: list.map((control, index) => getControlType(control, index, type, false, className))
			}
			{list.length > 4 &&
          <ControlMore
              list={list.filter((type, index) => index > 2)}
              type={type}
              className={className}
          />}
		</>
	);
};

export default Control;