import { IsEmail, IsNotEmpty } from "class-validator";

export class LogUserDto {
    @IsEmail({}, {
        message: "L'email doit être une adresse email valide"
    })
    email: string;

    @IsNotEmpty()
    password: string;
}