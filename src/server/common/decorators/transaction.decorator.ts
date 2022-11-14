import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TransactionParam = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest();
		return req.transaction;
	},
);
