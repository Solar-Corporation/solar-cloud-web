import { FC } from 'react';
import { useCloudReducer } from '../../hooks/cloud';
import { useAppSelector } from '../../hooks/redux';
import { userAPI } from '../../services/UserService';
import { setIsModalOpen } from '../../store/reducers/ModalSlice';
import { AppModal } from './index';

export const ModalDeclineUser: FC = () => {
	const { userSelected, dispatch } = useCloudReducer();
	const { declineUser: isOpen } = useAppSelector(state => state.modalReducer.modal);
	const [deleteUser] = userAPI.useDeleteUserMutation();

	const handleClose = () => {
		dispatch(setIsModalOpen({ declineUser: false }));
	};

	const handleSubmit = async () => {
		handleClose();

		for (const user of userSelected) {
			await deleteUser(user.id);
		}
	};

	return (
		<AppModal
			title={`Отклонить ${userSelected.length > 1 ? 'заявки' : 'заявку'}`}
			okText="Отклонить"
			open={isOpen}
			onOk={handleSubmit}
			onCancel={handleClose}
		>
			<p>Вы уверены что хотите отклонить {
				userSelected.length > 1
					? `заявки от пользователей (${userSelected.length})`
					: userSelected.length && `заявку от пользователя "${userSelected[0].email}"`
			}?</p>
		</AppModal>
	);
};