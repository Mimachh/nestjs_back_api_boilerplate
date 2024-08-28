import { ValidationOptions, registerDecorator } from "class-validator";
import { ManyToManyConstraint } from "./many-to-many-constraint";



export type ManyToManyInterface = {
    tableName: string;
    column: string;
    forbiddenSlugFields?: string[];
}

export function ManyToMany(
    options: ManyToManyInterface,
    validationOptions?: ValidationOptions
    ) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: "many-to-many",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: ManyToManyConstraint,
        })
    }
}