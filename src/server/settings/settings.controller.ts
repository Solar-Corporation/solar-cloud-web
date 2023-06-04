import {
	ConflictException,
	Controller,
	Delete,
	Get,
	Param,
	Put,
	Req,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Transaction } from 'sequelize';
import { TransactionParam } from '../common/decorators/transaction.decorator';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { UserIdDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';

@Controller({ version: '1', path: 'settings' })
export class SettingsController {
	constructor(
		private readonly userService: UserService,
	) {
	}

	@Get('users')
	@UseGuards(AuthGuard())
	async getUsers() {
		return await this.userService.getUsers();
	}

	@Put('users/:userId')
	@UseGuards(AuthGuard())
	@UseInterceptors(TransactionInterceptor)
	async updateUserStatus(
		@Param() { userId }: UserIdDto,
		@TransactionParam() transaction: Transaction,
	) {
		await this.userService.updateUserEmailStatus(userId, transaction);
	}

	@Delete('users/:userId')
	@UseGuards(AuthGuard())
	@UseInterceptors(TransactionInterceptor)
	async deleteUser(
		@Req() { user }: any,
		@Param() { userId }: UserIdDto,
		@TransactionParam() transaction: Transaction,
	) {
		if (user.id === userId)
			throw new ConflictException('Вы не можете удалить сами себя!');
		await this.userService.deleteUserById(userId, transaction);
	}
}
