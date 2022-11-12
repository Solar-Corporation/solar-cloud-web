import { FullName } from './user.type';

export type EmailLoginOptions = {
	email: string;
	password: string;
};

export type JwtToken = {
	refresh: string;
	access: string;
};

export type TokenPayload = {
	user_id: string;
	email: string;
	phone_number: string;
	fullName: FullName;
};
