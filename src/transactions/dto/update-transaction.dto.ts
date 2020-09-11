import { Type } from "src/type.enum";

export class UpdateTransactionDto {
    amount: number;
    type: Type;
    title: string;
}