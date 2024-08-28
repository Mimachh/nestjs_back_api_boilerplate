import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsEmailExistConstraint } from './existing-email-constraint';

export type IsEmailExistInput = {
    tableName: string;
    column: string;
}

export function isEmailExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'is-email-exist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsEmailExistConstraint,
    });
  };
}
