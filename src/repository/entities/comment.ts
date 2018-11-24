import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn
} from "typeorm";

@Entity()
export class Comment {
	constructor(
		memeId: number,
		username: string,
		text: string,
		parentCommentId?: number
	) {
		this.memeId = memeId;
		this.username = username;
		this.text = text;
		this.parentCommentId = parentCommentId;
	}

	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	memeId!: number;

	@Column()
	username!: string;

	@Column({ nullable: true })
	parentCommentId?: number;

	@Column()
	text!: string;

	@CreateDateColumn()
	postDate!: Date;

	@UpdateDateColumn()
	lastEdited!: Date;
}
