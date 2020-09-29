import { Type } from "src/type.enum";
import { IsNotEmpty } from "class-validator";

export class CreateRecurringPaymentDto {
    
    @IsNotEmpty({ message: 'amount should not be empty'})
    amount: number;

    type: Type;

    title: string;

    note: string;

    tag: string;

    date: Date;

    @IsNotEmpty()
    start_date: Date;

    @IsNotEmpty()
    end_date: Date;

    @IsNotEmpty()
    frequency: number;

    @IsNotEmpty()
    category_id: number;

    @IsNotEmpty()
    account_id: number;
}
