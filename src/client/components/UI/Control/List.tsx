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

enum Control {
	NULL,
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

interface ActionListProps {
	list: Control[];
}

export const getControlType = (type: Control, index: number, context?: boolean) => {
	return [
		type === Control.INFO && <ControlInfo key={index} context={context} />,
		type === Control.VIEW && <ControlView key={index} context={context} />,
		type === Control.SHARE && <ControlShare key={index} context={context} />,
		type === Control.DOWNLOAD && <ControlDownload key={index} context={context} />,
		type === Control.DELETE && <ControlDelete key={index} context={context} />,
		type === Control.RENAME && <ControlRename key={index} context={context} />,
		type === Control.MOVE && <ControlMove key={index} context={context} />,
		type === Control.COPY && <ControlCopy key={index} context={context} />,
		type === Control.MARK && <ControlMark key={index} context={context} />
	];
};

export const ControlList: FC<ActionListProps> = ({ list }) => {
	return (
		<>
			{list.map((type, index) =>
				(index < 3)
					? getControlType(type, index)
					: null
			)}
			{list.length > 3 && <ControlMore list={list.filter((type, index) => index > 2)} />}
		</>
	);
};

export default Control;