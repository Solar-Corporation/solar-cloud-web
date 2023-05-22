import { FC, MouseEvent, useEffect, useState } from 'react';
import { useCloudReducer } from '../../hooks/cloud';
import { IUser } from '../../models/IUser';
import { clearUserSelected, selectUser, unselectUser } from '../../store/reducers/CloudSlice';
import styles from '../../styles/components/FileTable.module.less';

interface UserTableRow {
	user: IUser;
}

export const UserTableRow: FC<UserTableRow> = ({ user }) => {
	const [isSelected, setIsSelected] = useState(false);
	const { userSelected, dispatch } = useCloudReducer();

	const handleClick = (event: MouseEvent<HTMLDivElement>) => {
		if (event.ctrlKey) {
			if (!isSelected) {
				dispatch(selectUser(user));
			} else {
				dispatch(unselectUser(user));
			}
		} else {
			if (userSelected.length > 1) {
				dispatch(clearUserSelected());
				dispatch(selectUser(user));
			} else {
				if (!isSelected) {
					dispatch(clearUserSelected());
					dispatch(selectUser(user));
				}
			}
		}
	};

	const handleContextMenu = () => {
		if (!isSelected) {
			dispatch(clearUserSelected());
			dispatch(selectUser(user));
		}
	};

	useEffect(() => {
		setIsSelected(!!userSelected.find(selectedUser => selectedUser.id === user.id));
	}, [userSelected]);

	return (
		<div
			className={isSelected ? `${styles.selected} ${styles.row}` : styles.row}
			onClick={handleClick}
			onContextMenu={handleContextMenu}
		>
			<div className={styles.column}>
				<div className={styles.name}>
					<span className={styles.nameText}>
						{user.fullName.lastName} {user.fullName.firstName} {user.fullName.middleName}
					</span>
				</div>
			</div>
			<div className={styles.columns}>
				<div className={styles.column} style={{ minWidth: 400, maxWidth: 400 }}>{user.email}</div>
				<div className={styles.column} style={{ minWidth: 170, maxWidth: 170 }}>{user.isVerify ? 'Подтвержден' : 'Не подтвержден'}</div>
			</div>
		</div>
	);
};