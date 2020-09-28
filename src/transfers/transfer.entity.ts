import { Account } from "src/accounts/account.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transfer extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "decimal", nullable: false })
    amount: number;

    @Column('date', { name: 'date', default: (): string => 'LOCALTIMESTAMP' })
    date?: Date;

    @ManyToOne(type => Account, account => account.transfers_from, { eager: false })
    from_account: Account;

    @ManyToOne(type => Account, account => account.transfers_to, { eager: false })
    to_account: Account;
}
