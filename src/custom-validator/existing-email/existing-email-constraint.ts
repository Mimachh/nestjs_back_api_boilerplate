import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { PrismaService } from "src/prisma.service";

@ValidatorConstraint({name: 'IsEmailExistConstraint', async: true})
@Injectable()
export class IsEmailExistConstraint implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) {}
    
    async validate(value: any, validationArguments?: ValidationArguments,): Promise<boolean> {
        const tableName = "user";
        const column = "email";
        const existingRecord = await this.prisma[tableName].findFirst({
            where: {
                [column]: value,
            },
        });
        if(existingRecord) return true;
        return false;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Email does not exist';
    }
}