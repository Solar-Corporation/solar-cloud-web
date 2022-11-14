import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Transaction } from 'sequelize';
import { SequelizeConnect } from '../../database/database-connect';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {

	async intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Promise<Observable<any>> {
		const httpContext = context.switchToHttp();
		const req = httpContext.getRequest();
		const transaction: Transaction = await SequelizeConnect.transaction();
		req.transaction = transaction;
		return next
			.handle()
			.pipe(
				tap(async () => {
					await transaction.commit();
				}),
				catchError(async (err) => {
					await transaction.rollback();
					throw err;
				}),
			);
	}
}
