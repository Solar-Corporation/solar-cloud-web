import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { CloudLayout } from '../client/components/Cloud/Layout';
import Control from '../client/components/UI/Control/List';
import { UserTable } from '../client/components/UserTable';
import { useCloudReducer } from '../client/hooks/cloud';
import { IUser } from '../client/models/IUser';
import { RouteNames } from '../client/router';
import { privateRoute } from '../client/router/private';
import { filesAPI } from '../client/services/FilesService';
import { userAPI } from '../client/services/UserService';
import { wrapper } from '../client/store';
import { getIsActive, setInitialData } from '../client/utils';

const getControls = (selected: IUser[]) => (
	selected.length
		? getIsActive(selected) ? [Control.ACCEPT, Control.DECLINE] : [Control.DELETE_USER]
		: []
);

export default function Settings({ users, space }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { userSelected } = useCloudReducer();

	return (
		<CloudLayout
			title="Настройки"
			headingOptions={{
				links: [{ title: 'Настройки', href: RouteNames.SETTINGS }],
				constControls: getControls(userSelected)
			}}
			space={space}
		>
			<UserTable
				users={users}
				contextMenu={getControls(userSelected)}
			/>
		</CloudLayout>
	);
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(store => async ctx => {
	const { dispatch } = store;
	setInitialData(ctx, dispatch, null);
	const { data: users, error } = await dispatch(userAPI.endpoints.getUsers.initiate());
	const { data: space } = await dispatch(filesAPI.endpoints.getSpace.initiate());

	return privateRoute({ users: users || null, space: space || null }, error, RouteNames.SETTINGS);
});