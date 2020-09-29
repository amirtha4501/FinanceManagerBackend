import { IsNotEmpty } from "class-validator";

export class UpdateTransferDto {
    
    amount: number;

    date: Date;

    @IsNotEmpty()
    from_account_id: number;

    @IsNotEmpty()
    to_account_id: number;
}
