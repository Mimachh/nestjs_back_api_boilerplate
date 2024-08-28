import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";
import { IsUnique } from "src/custom-validator/is-unique/is-unique";
import { ManyToMany } from "src/custom-validator/many-to-many/many-to-many";
import { Match } from "src/custom-validator/match.decorator";
import { excludeRolesFieldsFromValidation } from "src/lib/exclude-fields";


export class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  zip: string;

  @IsString()
  country: string;
}


export class CreateUserDto {
    @IsUnique({tableName: 'user', column: 'email'})
    @IsEmail({}, {
        message: "L'email doit être une adresse email valide"
    })
    email: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(20, { message: 'Password must be at most 20 characters long' })
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, { 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character' 
    })
    password: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Match('password', {message: 'passwords do not match'})
    passwordConfirm: string;

    @IsString()
    firstName: string;


    // TODO
    // Test the validator
    @ManyToMany({tableName: 'role', column: 'slug', forbiddenSlugFields: excludeRolesFieldsFromValidation})
    @IsArray()
    role: Array<string>;


    @ValidateIf(o => o.role.includes('vendor') || o.role.includes('pro'))
    @IsArray()
    address: AddressDto;
}


