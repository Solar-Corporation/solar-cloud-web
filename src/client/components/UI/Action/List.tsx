import { FC } from 'react';
import { ActionCreate } from './types/Create';

export enum Action {
	NULL,
	CREATE
}

interface ActionListProps {
	list: Action[];
}

export const ActionList: FC<ActionListProps> = ({ list }) => {
	return (
		<>
			{list.map((type, index) => [
				type === Action.CREATE && <ActionCreate key={index} />
			])}
		</>
	);
};