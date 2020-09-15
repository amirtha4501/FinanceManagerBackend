import { IsNotEmpty } from "class-validator";
import { User } from "src/auth/user.entity";

export class CreateAccountDto {
       
    @IsNotEmpty()
    name: string;

    current_amount: number;

    // planned_amount: number;

}