import { IsNotEmpty } from "class-validator";

export class CreateAccountDto {
       
    @IsNotEmpty()
    name: string;

    current_amount: number;

    // planned_amount: number;

    @IsNotEmpty()
    user_id: number;
}