import { Type } from "src/type.enum";

export class FilterTransactionDto {
    type: Type;
    // category: string;
    // account: string;
    amountFrom: number;
    amountTo: number;
    // tag: string;
}