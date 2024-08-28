import { IsEmail } from "class-validator";
import { isEmailExist } from "src/custom-validator/existing-email/existing-email.decorator";

export class ForgotPasswordDto {
    @isEmailExist()
    @IsEmail({}, {
        message: "L'email doit être une adresse email valide"
    })
    email: string;
}