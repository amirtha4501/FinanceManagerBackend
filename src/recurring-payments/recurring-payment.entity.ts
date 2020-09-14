import { Type } from "src/type.enum";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

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

    @Column({ nullable: false})
    category_id: number;

    @Column({ nullable: false })
    account_id: number;
}
