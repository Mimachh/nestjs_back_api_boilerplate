import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { PrismaService } from 'src/prisma.service';
import { ManyToManyInterface } from './many-to-many';

@ValidatorConstraint({ name: 'ManyToManyConstraint', async: true })
@Injectable()
export class ManyToManyConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any[], args?: ValidationArguments): Promise<boolean> {
    const { tableName, column, forbiddenSlugFields }: ManyToManyInterface =
      args.constraints[0];

    let excludedFields = [];
    if (forbiddenSlugFields) {
        const forbiddenSlugFieldsExist = await this.prisma[tableName].findMany({
            where: {
                slug: {
                    in: forbiddenSlugFields
                }
            }
        });

        excludedFields = forbiddenSlugFieldsExist.map((field: any) => field.id);
    }

   const manyModel = await this.prisma[tableName].findMany({
        where: {
            NOT: {
                id: {
                    in: excludedFields
                }
            }
        }
    });

    if (manyModel.length === 0) return false;
    if (value.length === 0) return false;

    const manyModelValues = manyModel.map((model: any) => model[column]);
    const exist = value.every((val: any) => manyModelValues.includes(val));
    return exist;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    const field: string = validationArguments.property;
    return `A role does not exist`;
  }
}
