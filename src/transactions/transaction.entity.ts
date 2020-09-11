import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Type } from "../type.enum";

@Entity()
export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "decimal", nullable: false })
    amount: number;

    @Column({ nullable: false })
    type: Type;

    @Column()
    title: string;

    @Column()
    note: string;

    @Column()
    tag: string;

    @Column({ nullable: false })
    date: Date;

    @Column()
    is_planned: boolean;

    @Column({ nullable: false})
    category_id: number;

    @Column()
    recurring_payment_id: number;

    @Column({ nullable: false })
    account_id: number;
}