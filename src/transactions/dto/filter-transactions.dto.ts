import { Type } from "src/type.enum";

export class FilterTransactionsDto {
    
    type: Type;
    
    category: string;
    
    account: string;
    
    amountFrom: number;
    
    amountTo: number;
    
    dateFrom;

    dateTo;
    
    tag: string;
}