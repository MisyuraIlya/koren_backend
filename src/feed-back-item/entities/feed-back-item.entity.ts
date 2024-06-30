import { AuthEntity } from "src/auth/entities/auth.entity";
import { FeedBackMain } from "src/feed-back-main/entities/feed-back-main.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'feed_back_item' })
export class FeedBackItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => FeedBackMain, main => main.items, {onDelete: "CASCADE"})
    main: FeedBackMain;

    @ManyToOne(() => AuthEntity, main => main.feedbacks, {onDelete: "CASCADE"})
    user: AuthEntity;
    
}
