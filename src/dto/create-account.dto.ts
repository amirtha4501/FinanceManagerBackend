import { IsNotEmpty } from "class-validator";
import { User } from "src/entity/user.entity";

export class CreateAccountDto {
       
    @IsNotEmpty()
    name: string;

    current_amount: number;

    date: Date;
    // planned_amount: number;

}