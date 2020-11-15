import { User } from "src/entity/user.entity";
import { Transaction } from "src/entity/transaction.entity";
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
}
