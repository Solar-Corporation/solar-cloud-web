export interface IUser {
	id: number;
	email: string;
	fullName: {
		lastName: string;
		firstName: string;
		middleName: string;
	};
	nickname: string;
	isActive?: boolean;
}