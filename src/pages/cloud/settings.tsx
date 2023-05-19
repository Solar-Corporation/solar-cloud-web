import { CloudLayout } from '../../client/components/Cloud/Layout';
import Control from '../../client/components/UI/Control/List';
import { UserTable } from '../../client/components/UserTable';
import { useCloudReducer } from '../../client/hooks/cloud';
import { IUser } from '../../client/models/IUser';
import { RouteNames } from '../../client/router';
import { getIsActive } from '../../client/utils';

const getControls = (selected: IUser[]) => (
	selected.length
		? getIsActive(selected) ? [Control.ACCEPT, Control.DECLINE] : [Control.DELETE_USER]
		: []
);

export default function Settings() {
	const { userSelected } = useCloudReducer();
	const users: IUser[] = [
		{
			id: 1,
			fullName: {
				lastName: 'Косенко',
				firstName: 'Даниил',
				middleName: 'Вячеславович'
			},
			email: 'example@example.com',
			nickname: '',
			isActive: true
		},
		{
			id: 2,
			fullName: {
				lastName: 'Валетов',
				firstName: 'Стефан',
				middleName: 'Анатольевич'
			},
			email: 'stormerxl24@gmail.com',
			nickname: '',
			isActive: false
		},
		{
			id: 3,
			fullName: {
				lastName: 'Валетов',
				firstName: 'Стефан',
				middleName: 'Анатольевич'
			},
			email: 'stormerxl24@gmail.com',
			nickname: '',
			isActive: false
		}
	];

	return (
		<CloudLayout
			title="Настройки"
			headingOptions={{
				links: [{ title: 'Настройки', href: RouteNames.SETTINGS }],
				constControls: getControls(userSelected)
			}}
		>
			<UserTable
				users={users}
				contextMenu={getControls(userSelected)}
			/>
		</CloudLayout>
	);
}