import { FC } from 'react';
import { ControlInfo } from './types/Info';
import { ControlView } from './types/View';

export enum Control {
	NULL,
	INFO,
	VIEW
}

interface ActionListProps {
	list: Control[];
}

export const ControlList: FC<ActionListProps> = ({ list }) => {
	return (
		<>
			{list.map((type, index) => [
				type === Control.INFO && <ControlInfo key={index} />,
				type === Control.VIEW && <ControlView key={index} />
			])}
		</>
	);
};