import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Transaction } from 'sequelize';
import { FileService } from '../../../solar-s3';
import { EmailLoginDto, UserRegistrationDto } from '../auth/dto';
import { ErrorsConfig } from '../config/error.config';
import { UserDto } from './dto/user.dto';
import { UserDatabaseService } from './user-database.service';

@Injectable()
export class UserService {
	constructor(
		private readonly userDatabaseService: UserDatabaseService,
		private readonly configService: ConfigService,
	) {
	}

	async addUser(addUser: UserRegistrationDto, storage: number, transaction: Transaction): Promise<UserDto> {
		const { email, password } = addUser;
		const isUserExist = await this.userDatabaseService.checkEmail(email);
		if (isUserExist)
			throw new ConflictException(ErrorsConfig.userExist.message, ErrorsConfig.userExist.message);

		const salt = await bcrypt.genSalt();
		addUser.password = await bcrypt.hash(password, salt);

		const userDto = await this.userDatabaseService.createUser(addUser, transaction);
		await FileService.createUserDir({ uuid: userDto.uuid, storage: storage }, this.configService.get('app.path')!);
		return userDto;
	}

	async checkUser(loginData: EmailLoginDto): Promise<UserDto> {
		const { email, password } = loginData;

		const isUserExist = await this.userDatabaseService.checkEmail(email);
		if (!isUserExist)
			throw new NotFoundException(ErrorsConfig.emailNotFound.message, ErrorsConfig.emailNotFound.message);

		const isEmailVerify = await this.userDatabaseService.isEmailVerify(email);

		if (!isEmailVerify)
			throw new ConflictException('Email is not verify!');

		const userAuthDto = await this.userDatabaseService.getUserByEmail(email);

		const isPasswordCompare = await bcrypt.compare(password, userAuthDto.password);
		if (!isPasswordCompare)
			throw new UnauthorizedException(ErrorsConfig.wrongPassword.message, ErrorsConfig.wrongPassword.message);

		const userDto: any = userAuthDto;
		delete userDto.password;
		return userDto;
	}

}
