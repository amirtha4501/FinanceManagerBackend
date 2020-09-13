import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp, Unique } from "typeorm";

@Entity()
@Unique(['account_name'])
export class Account extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    account_name: string;

    @Column({ type: "decimal", default: 0 })
    current_amount: number;

    @Column({ type: "decimal", nullable: true })
    planned_amount: number;

    @Column('date', { name: 'date', default: (): string => 'LOCALTIMESTAMP' })
    date?: Date;

    @Column('time', {default: (): string => 'LOCALTIMESTAMP'})
    time?: Timestamp;

    @Column()
    user_id: number;
}
