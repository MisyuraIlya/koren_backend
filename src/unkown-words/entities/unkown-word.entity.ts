import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'unkown_word' })
export class UnkownWord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    word: string;

    @Column({nullable: true})
    description: string;
}
