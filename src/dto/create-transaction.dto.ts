import { Type } from "src/type.enum";
import { IsNotEmpty } from "class-validator";

export class CreateTransactionDto {

    @IsNotEmpty({ message: 'amount should not be empty'})
    amount: number;

    @IsNotEmpty({ message: 'transaction type should not be empty'})
    type: Type;

    @IsNotEmpty({ message: 'title should not be empty'})
    title: string;

    note: string;

    tag: string;

    date: Date;

    is_planned: boolean;

    @IsNotEmpty()
    category_id: number;

    recurring_payment_id: number;

    @IsNotEmpty()
    account_id: number;
}