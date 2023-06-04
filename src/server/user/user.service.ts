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
	private readonly basePath;
	private readonly baseName;

	constructor(
		private readonly userDbService: UserDatabaseService,
		private readonly bucketService: BucketService,
		private readonly configService: ConfigService,
		private readonly storageService: StorageService,
	) {
		this.basePath = this.configService.get('app.path');
		this.baseName = this.configService.get('app.name');
	}

	async addUser(addUser: UserRegistrationDto, storage: number, transaction: Transaction): Promise<UserDto> {
		const { email, password } = addUser;
		const isUserExist = await this.userDbService.checkEmail(email);
		if (isUserExist)
			throw new ConflictException(ErrorsConfig.userExist.message, ErrorsConfig.userExist.message);

		const salt = await bcrypt.genSalt();
		addUser.password = await bcrypt.hash(password, salt);

		const userDto = await this.userDbService.createUser(addUser, transaction);
		const store = await this.storageService.open(this.basePath, this.baseName);

		await this.bucketService.create(store, userDto.uuid, storage);
		return userDto;
	}

	async checkUser(loginData: EmailLoginDto): Promise<UserDto> {
		const { email, password } = loginData;

		const isUserExist = await this.userDbService.checkEmail(email);
		if (!isUserExist)
			throw new NotFoundException(ErrorsConfig.emailNotFound.message, ErrorsConfig.emailNotFound.message);

		const isEmailVerify = await this.userDbService.isEmailVerify(email);

		if (!isEmailVerify)
			throw new ConflictException('Email is not verify!');

		const userAuthDto = await this.userDbService.getUserByEmail(email);

		const isPasswordCompare = await bcrypt.compare(password, userAuthDto.password);
		if (!isPasswordCompare)
			throw new UnauthorizedException(ErrorsConfig.wrongPassword.message, ErrorsConfig.wrongPassword.message);

		const userDto: any = userAuthDto;
		delete userDto.password;
		return userDto;
	}

	async getUsers(): Promise<Array<UserDto>> {
		return await this.userDbService.getUsersList();
	}

	async updateUserEmailStatus(userId: number, transaction: Transaction) {
		await this.userDbService.updateUserEmailStatus(userId, transaction);
	}

	async deleteUserById(userId: number, transaction: Transaction) {
		const userUuid = await this.userDbService.deleteUser(userId, transaction);
		const store = await this.storageService.open(this.basePath, this.baseName);
		await this.bucketService.delete(store, userUuid);
	}
}
