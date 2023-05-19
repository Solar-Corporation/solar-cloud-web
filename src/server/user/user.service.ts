import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Transaction } from 'sequelize';
import { EmailLoginDto, UserRegistrationDto } from '../auth/dto';
import { ErrorsConfig } from '../config/error.config';
import { BucketService } from '../s3/bucket.service';
import { StorageService } from '../s3/storage.service';
import { UserDto } from './dto/user.dto';
import { UserDatabaseService } from './user-database.service';

@Injectable()
export class UserService {
	constructor(
		private readonly userDatabaseService: UserDatabaseService,
		private readonly bucketService: BucketService,
		private readonly configService: ConfigService,
		private readonly storageService: StorageService,
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
		const store = await this.storageService.open(this.configService.get('app.path')!, this.configService.get('app.name')!);

		await this.bucketService.create(store, userDto.uuid, storage);
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
