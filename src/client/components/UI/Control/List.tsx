import { ButtonProps } from 'antd';
import { FC } from 'react';
import { ControlCopy } from './types/Copy';
import { ControlCreate } from './types/Create';
import { ControlDelete } from './types/Delete';
import { ControlDownload } from './types/Download';
import { ControlInfo } from './types/Info';
import { ControlMark } from './types/Mark';
import { ControlMore } from './types/More';
import { ControlMove } from './types/Move';
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
	RENAME,
	MOVE,
	COPY,
	MARK
}

interface ControlListProps {
	list: Control[];
	type?: ButtonProps['type'];
	className?: string;
}

export const getControlType = (type: Control, index: number, buttonType?: ButtonProps['type'], block?: boolean, className?: string) => {
	return [
		type === Control.CREATE &&
		<ControlCreate key={index} type={buttonType} block={block} className={className} />,
		type === Control.UPLOAD &&
		<ControlUpload key={index} type={buttonType} block={block} className={className} />,
		type === Control.UPLOAD_FOLDER &&
		<ControlUpload key={index} type={buttonType} block={block} className={className} folder />,
		type === Control.INFO &&
		<ControlInfo key={index} type={buttonType} block={block} className={className} />,
		type === Control.VIEW &&
		<ControlView key={index} type={buttonType} block={block} className={className} />,
		type === Control.SHARE &&
		<ControlShare key={index} type={buttonType} block={block} className={className} />,
		type === Control.DOWNLOAD &&
		<ControlDownload key={index} type={buttonType} block={block} className={className} />,
		type === Control.DELETE &&
		<ControlDelete key={index} type={buttonType} block={block} className={className} />,
		type === Control.RENAME &&
		<ControlRename key={index} type={buttonType} block={block} className={className} />,
		type === Control.MOVE &&
		<ControlMove key={index} type={buttonType} block={block} className={className} />,
		type === Control.COPY &&
		<ControlCopy key={index} type={buttonType} block={block} className={className} />,
		type === Control.MARK &&
		<ControlMark key={index} type={buttonType} block={block} className={className} />
	];
};

export const ControlList: FC<ControlListProps> = ({ list, type, className }) => {
	return (
		<>
			{list.map((control, index) =>
				(index < 3)
					? getControlType(control, index, type, false, className)
					: null
			)}
			{list.length > 3 &&
				<ControlMore
					list={list.filter((type, index) => index > 2)}
					type={type}
					className={className}
				/>
			}
		</>
	);
};

export default Control;