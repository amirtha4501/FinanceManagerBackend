import { IsNotEmpty } from "class-validator";
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Timestamp } from "typeorm";
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

    @Column('time', {default: (): string => 'LOCALTIMESTAMP'})
    time?: Timestamp;
  
    @Column({ nullable: true, default: false })
    is_planned: boolean;

    @Column({ nullable: false})
    category_id: number;

    @Column({ nullable: true })
    recurring_payment_id: number;

    @Column({ nullable: false })
    account_id: number;
}