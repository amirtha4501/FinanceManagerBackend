import { Type } from "../transaction.model";

export class FilterTransactionDto {
    type: Type;
    // category: string;
    // account: string;
    amountFrom: number;
    amountTo: number;
    // tag: string;
}