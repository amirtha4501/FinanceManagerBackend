import { Type } from "../transaction.model";
import { IsNotEmpty } from "class-validator";

export class CreateTransactionDto {

    @IsNotEmpty()
    amount: number;

    @IsNotEmpty()
    type: Type;
    
    title: string;
}