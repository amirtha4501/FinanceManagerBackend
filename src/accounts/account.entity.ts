import { User } from "src/auth/user.entity";
import { Transaction } from "src/transactions/transaction.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

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

    @ManyToOne(type => User, user => user.accounts, { eager: false })
    user: User;

    @OneToMany(type => Transaction, transaction => transaction.account, { eager: true })
    transactions: Transaction[]
}
