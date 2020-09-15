import { IsEmail } from "class-validator";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Account } from "src/accounts/account.entity";

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    @IsEmail({}, { message: 'Incorrect email' })
    email: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @OneToMany(type => Account, account => account.user, { eager: true })
    accounts: Account[];

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}