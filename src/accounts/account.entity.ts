import { User } from "src/auth/user.entity";
import { Transaction } from "src/transactions/transaction.entity";
import { Transfer } from "src/transfers/transfer.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
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

    @ManyToOne(type => User, user => user.accounts, { eager: false, onDelete: 'CASCADE' })
    user: User;

    @OneToMany(type => Transaction, transaction => transaction.account, { eager: true, cascade: true })
    transactions: Transaction[]

    @OneToMany(type => Transfer, transfer => transfer.from_account, { eager: true, cascade: true })
    transfers_from: Transfer[]

    @OneToMany(type => Transfer, transfer => transfer.to_account, { eager: true, cascade: true })
    transfers_to: Transfer[]
}
