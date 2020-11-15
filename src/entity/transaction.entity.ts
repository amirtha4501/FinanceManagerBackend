import { Account } from "src/entity/account.entity";
import { Category } from "src/entity/category.entity";
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

    @Column({ nullable: true })
    recurring_payment_id: number;

    @ManyToOne(type => Account, account => account.transactions, { eager: false, onDelete: 'CASCADE' })
    account: Account;
   
    @ManyToOne(type => Category, category => category.transactions, { eager: false, onDelete: "SET NULL" })
    category: Category;
}
