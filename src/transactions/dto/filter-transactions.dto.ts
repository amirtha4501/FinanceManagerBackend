import { Type } from "src/type.enum";

export class FilterTransactionsDto {
    
    type: Type;
    
    category: string;
    
    specifiedAccount: number;
    
    amountFrom: number;
    
    amountTo: number;
    
    dateFrom;

    dateTo;
    
    tag: string;
}
