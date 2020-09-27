import { Account } from "src/accounts/account.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transfer extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    // @Column()
    // from_account_id: number;

    // @Column()
    // to_account_id: number;

    @ManyToOne(type => Account, account => account.transfers_from, { eager: false })
    from_account: Account;

    @ManyToOne(type => Account, account => account.transfers_to, { eager: false })
    to_account: Account;
}
