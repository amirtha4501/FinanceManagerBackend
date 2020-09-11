import { Type } from "src/type.enum";
import { IsNotEmpty, IsEnum, IsDate } from "class-validator";
import { Transaction } from "../transaction.entity";

export class CreateTransactionDto {

    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    amount: number;

    @IsNotEmpty()
    @IsEnum(Transaction)
    type: Type;

    title: string;

    note: string;

    tag: string;

    @IsDate()
    date: Date;

    is_planned: boolean;

    @IsNotEmpty()
    category_id: number;

    recurring_payment_id: number;

    @IsNotEmpty()
    account_id: number;
}