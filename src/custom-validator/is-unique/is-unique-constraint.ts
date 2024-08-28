import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";


import { PrismaService } from "src/prisma.service";
import { IsUniqueInterface } from "./is-unique";


@ValidatorConstraint({ name: "IsUniqueConstraint", async: true})
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) {}

    async validate(
        value: any,
        args?: ValidationArguments): Promise<boolean> {
            const {tableName, column}: IsUniqueInterface = args.constraints[0]
            const existingRecord = await this.prisma[tableName].findFirst({
                where: {
                    [column]: value,
                },
            });
            return !existingRecord;
        }
        defaultMessage(validationArguments?: ValidationArguments): string {
            const field: string = validationArguments.property
            return `${field} is already exist`
        }
}