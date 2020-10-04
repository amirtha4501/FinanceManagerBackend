import { User } from "src/auth/user.entity";
// import { RecurringPayment } from "src/recurring-payments/recurring-payment.entity";
import { Transaction } from "src/transactions/transaction.entity";
import { Type } from "src/type.enum";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class Category extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    parent_id: number;

    @Column()
    starred: boolean;

    @Column()
    type: Type;

    @Column()
    color: string;

    @ManyToOne(type => User, user => user.categories, { eager: false, onDelete: 'CASCADE' })
    user: User;
    
    @OneToMany(type => Transaction, transaction => transaction.category, { eager: true, cascade: true })
    transactions: Transaction[]
    
    // @OneToMany(type => RecurringPayment, recurringPayment => recurringPayment.category, { eager: true })
    // recurringPayments: RecurringPayment[]
}
// cascade: true, ondelete: set default