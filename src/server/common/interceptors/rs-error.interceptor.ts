import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RsErrorInterceptor implements NestInterceptor {

	async intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Promise<Observable<any>> {
		return next
			.handle()
			.pipe(
				catchError(async (err) => {
					if (!err.code)
						throw err;

					throw new HttpException({
						status: HttpStatus.FORBIDDEN,
						error: String(err).replace('Error: ', ''),
					}, HttpStatus.FORBIDDEN, {
						cause: err,
					});
				}),
			);
	}
}
