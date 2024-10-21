import { TypeFeedBack } from "src/enums/feedback.enum";
import { FeedBackItem } from "src/feed-back-item/entities/feed-back-item.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'feed_back_main' })
export class FeedBackMain {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({
        type: 'enum',
        enum: TypeFeedBack,
        default: TypeFeedBack.Positive, 
    })
    type: TypeFeedBack;

    @OneToMany(() => FeedBackItem, item => item.main , { cascade: ["remove"] })
    items: FeedBackItem[];
}
