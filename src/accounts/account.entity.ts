import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['name'])
export class Account extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: "decimal", default: 0 })
    current_amount: number;

    @Column({ type: "decimal", nullable: true })
    planned_amount: number;

    @Column('date', { name: 'date', default: (): string => 'LOCALTIMESTAMP' })
    date?: Date;

    @Column()
    user_id: number;
}
