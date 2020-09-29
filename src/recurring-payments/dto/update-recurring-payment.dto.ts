import { IsNotEmpty } from "class-validator";
import { Type } from "src/type.enum";

export class UpdateRecurringPaymentDto {
    
    amount: number;

    type: Type;

    title: string;

    note: string;

    tag: string;

    date: Date;

    start_date: Date;

    end_date: Date;

    frequency: number;
    
    category_id: number;

    account_id: number;

}
