import { FC } from 'react';
import { ControlInfo } from './types/Info';
import { ControlView } from './types/View';
import { ControlShare } from './types/Share';
import { ControlDownload } from './types/Download';
import { ControlDelete } from './types/Delete';
import { ControlMore } from './types/More';
import { ControlRename } from './types/Rename';
import { ControlMove } from './types/Move';
import { ControlCopy } from './types/Copy';
import { ControlMark } from './types/Mark';
import { ControlCreate } from './types/Create';

enum Control {
	NULL,
	CREATE,
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
	primary?: boolean;
}

export const getControlType = (type: Control, index: number, primary?: boolean, context?: boolean) => {
	return [
		type === Control.CREATE && <ControlCreate key={index} context={context} primary={primary} />,
		type === Control.INFO && <ControlInfo key={index} context={context} primary={primary} />,
		type === Control.VIEW && <ControlView key={index} context={context} primary={primary} />,
		type === Control.SHARE && <ControlShare key={index} context={context} primary={primary} />,
		type === Control.DOWNLOAD && <ControlDownload key={index} context={context} primary={primary} />,
		type === Control.DELETE && <ControlDelete key={index} context={context} primary={primary} />,
		type === Control.RENAME && <ControlRename key={index} context={context} primary={primary} />,
		type === Control.MOVE && <ControlMove key={index} context={context} primary={primary} />,
		type === Control.COPY && <ControlCopy key={index} context={context} primary={primary} />,
		type === Control.MARK && <ControlMark key={index} context={context} primary={primary} />
	];
};

export const ControlList: FC<ControlListProps> = ({ list, primary }) => {
	return (
		<>
			{list.map((type, index) =>
				(index < 3)
					? getControlType(type, index, primary)
					: null
			)}
			{list.length > 3 && <ControlMore list={list.filter((type, index) => index > 2)} />}
		</>
	);
};

export default Control;