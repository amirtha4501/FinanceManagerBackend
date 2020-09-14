import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transfer extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    from_account_id: number;

    @Column()
    to_account_id: number;
}
