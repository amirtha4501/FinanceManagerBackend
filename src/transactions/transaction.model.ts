export interface Transaction {
    id: number;
    amount: number;
    type: Type;
    title: string;
}

export enum Type {
    EXPENSE = 'EXPENSE',
    INCOME = 'INCOME'
}