import { IsEmail } from "class-validator";

export class AuthSignInDto {

    @IsEmail()
    email: string;
    
    password: string;
}
