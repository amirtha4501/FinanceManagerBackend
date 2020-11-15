import { IsNotEmpty } from "class-validator";

export class CreateTransferDto {

    @IsNotEmpty({ message: 'amount should not be empty'})
    amount: number;

    date: Date;

    @IsNotEmpty()
    from_account_id: number;

    @IsNotEmpty()
    to_account_id: number;
}
