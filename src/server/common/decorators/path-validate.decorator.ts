import { Injectable } from '@nestjs/common';
import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'AbsolutePath', async: true })
@Injectable()
export class IsAbsolutePath implements ValidatorConstraintInterface {
	public async validate(paths: any, args: ValidationArguments) {
		const regEx = new RegExp('\\.\\.+', 'gm');

		if (Array.isArray(paths))
			paths = paths.join('');

		return !regEx.test(paths);
	}

	public defaultMessage(validationArguments?: ValidationArguments): string {
		return 'Path must be absolute!';
	}
}

export function AbsolutePath(validationOptions?: ValidationOptions) {
	return function(object: any, propertyName: string) {
		registerDecorator({
			name: 'AbsolutePath',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: IsAbsolutePath,
		});
	};
}
