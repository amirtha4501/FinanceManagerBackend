import { Type } from "src/type.enum";

export class FilterRecurringPaymentsDto {
    
    type: Type;

    // title: string;
    
    tag: string;

    categoryName: string;
    
    specifiedAccount: number;
    
    amountFrom: number;
    
    amountTo: number;
    
    dateFrom: Date;

    dateTo: Date;    
}
