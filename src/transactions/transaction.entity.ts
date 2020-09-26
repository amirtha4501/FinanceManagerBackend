import { IsNotEmpty } from "class-validator";
import { Account } from "src/accounts/account.entity";
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Timestamp, ManyToOne } from "typeorm";
import { Type } from "../type.enum";

@Entity()
export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "decimal", nullable: false })
    amount: number;

    @Column({ nullable: false })
    type: Type;

    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    note: string;

    @Column({ nullable: true })
    tag: string;

    @Column('date', { name: 'date', default: (): string => 'LOCALTIMESTAMP' })
    date?: Date;
  
    @Column({ nullable: true, default: false })
    is_planned: boolean;

    @Column({ nullable: false})
    category_id: number;

    @Column({ nullable: true })
    recurring_payment_id: number;

    // @Column({ nullable: false })
    // account_id: number;
    @ManyToOne(type => Account, account => account.transactions, { eager: false })
    account: Account;
}