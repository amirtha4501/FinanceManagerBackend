import { Type } from "../transaction.model";

export class UpdateTransactionDto {
    amount: number;
    type: Type;
    title: string;
}