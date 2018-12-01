import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	getRepository
} from "typeorm";
import { User, Meme } from ".";

@Entity()
export class Comment {
	constructor(
		memeId: number,
		username: string,
		text: string,
		parentCommentId?: number
	) {
		if (memeId) {
			const memeRepo = getRepository(Meme);
			if (memeRepo.find({ where: { id: memeId } })) {
				this.memeId = memeId;
			} else {
				throw new Error("Meme does not exist.");
			}
		} else {
			throw new Error("Missing parameter memeId.");
		}
		if (username) {
			const userRepo = getRepository(User);
			if (userRepo.find({ where: { username } })) {
				this.username = username;
			} else {
				throw new Error("User does not exist.");
			}
		} else {
			throw new Error("Missing parameter username.");
		}
		if (text) {
			const regexp = new RegExp(/^[\s\S]{1,3000}$/);
			if (regexp.test(text)) {
				this.text = text;
			} else {
				throw new Error("Text must be between 1 and 3000 characters.");
			}
		} else {
			throw new Error("Comment needs to have a text.");
		}
		if (parentCommentId) {
			const commentRepo = getRepository(Comment);
			if (commentRepo.find({ where: { id: parentCommentId } })) {
				this.parentCommentId = parentCommentId;
			} else {
				throw new Error("Parent comment does not exist.");
			}
		}
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
