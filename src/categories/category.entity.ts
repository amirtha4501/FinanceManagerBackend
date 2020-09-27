import { User } from "src/auth/user.entity";
import { Type } from "src/type.enum";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['name'])
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

    @ManyToOne(type => User, user => user.categories, { eager: false })
    user: User;
}
