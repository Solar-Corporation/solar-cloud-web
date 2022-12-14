export interface IAuth {
	email: string;
	password: string;
}

export interface IToken {
	access: string;
}

export interface IRegister {
	email: string;
	password: string;
	fullName: {
		firstName: string;
		middleName: string;
		lastName: string;
	};
}