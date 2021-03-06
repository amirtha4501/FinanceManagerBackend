import { IsNotEmpty } from "class-validator";
import { Type } from "src/type.enum";

export class UpdateTransactionDto {
    
    amount: number;

    type: Type;

    title: string;

    note: string;

    tag: string;

    date: Date;

    is_planned: boolean;

    category_id: number;

    recurring_payment_id: number;

    @IsNotEmpty()
    account_id: number;
}
