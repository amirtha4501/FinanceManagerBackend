import { Account } from "src/accounts/account.entity";
import { Category } from "src/categories/category.entity";
import { Type } from "src/type.enum";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RecurringPayment extends BaseEntity {

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

    @Column('date')
    start_date?: Date;

    @Column('date')
    end_date?: Date;

    @Column()
    frequency: number;

    @ManyToOne(type => Account, account => account.recurringPayments, { eager: false })
    account: Account;

    @ManyToOne(type => Category, category => category.recurringPayments, { eager: false })
    category: Category;
}
