import { FC } from 'react';
import { useCloudReducer } from '../../hooks/cloud';
import { IUser } from '../../models/IUser';
import { setIsFilesContextMenuOpen } from '../../store/reducers/CloudSlice';
import styles from '../../styles/components/FileTable.module.less';
import { ContextMenu } from '../ContextMenu';
import { ResultError } from '../Result/Error';
import Control from '../UI/Control/List';
import { UserTableHeader } from './Header';
import { UserTableRow } from './Row';

interface UserTableProps {
	users: IUser[] | null;
	contextMenu?: Control[];
}

export const UserTable: FC<UserTableProps> = ({ users, contextMenu }) => {
	const { isFilesContextMenuOpen, dispatch } = useCloudReducer();

	const handleClick = (event: any) => {
		event.stopPropagation();
	};

	const handleOpenChange = (isOpen: boolean) => {
		dispatch(setIsFilesContextMenuOpen(isOpen));
	};

	return (
		users
			? users.length
				? (
					<div className={styles.main}>
						<UserTableHeader />
						<ContextMenu
							menu={contextMenu}
							open={isFilesContextMenuOpen}
							onOpenChange={handleOpenChange}
						>
							<div onClick={handleClick} onContextMenu={handleClick}>
								{users.map((user) => <UserTableRow key={user.id} user={user}/>)}
							</div>
						</ContextMenu>
					</div>
				) : null
			: <ResultError/>
	);
};