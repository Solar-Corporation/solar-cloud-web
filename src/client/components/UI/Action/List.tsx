import { FC } from 'react';
import { ActionCreate } from './types/Create';

enum Action {
	NULL,
	CREATE
}

interface ActionListProps {
	list: Action[];
}

export const getActionType = (type: Action, index: number, context?: boolean) => {
	return [
		type === Action.CREATE && <ActionCreate key={index} />
	];
};

export const ActionList: FC<ActionListProps> = ({ list }) => {
	return (
		<>
			{list.map((type, index) => getActionType(type, index))}
		</>
	);
};

export default Action;