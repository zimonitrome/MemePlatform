import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	getRepository
} from "typeorm";
import { User, Meme } from ".";
import { ValidationError } from "../../helpers/ValidationError";

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
				throw new ValidationError("Meme does not exist.");
			}
		} else {
			throw new ValidationError("Missing parameter memeId.");
		}
		if (username) {
			const userRepo = getRepository(User);
			if (userRepo.find({ where: { username } })) {
				this.username = username;
			} else {
				throw new ValidationError("User does not exist.");
			}
		} else {
			throw new ValidationError("Missing parameter username.");
		}
		this.text = Comment.validateText(text);
		if (parentCommentId) {
			const commentRepo = getRepository(Comment);
			if (commentRepo.find({ where: { id: parentCommentId } })) {
				this.parentCommentId = parentCommentId;
			} else {
				throw new ValidationError("Parent comment does not exist.");
			}
		}
	}

	static validateText(text: string): string {
		if (text) {
			const regexp = new RegExp(/^[\s\S]{1,3000}$/);
			if (regexp.test(text)) {
				return text;
			} else {
				throw new ValidationError(
					"Text must be between 1 and 3000 characters."
				);
			}
		} else {
			throw new ValidationError("Comment needs to have a text.");
		}
	}

	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	memeId!: number;

	@Column({ nullable: true })
	username!: string;

	@Column({ nullable: true })
	parentCommentId?: number;

	@Column({ nullable: true })
	text!: string;

	@CreateDateColumn()
	postDate!: Date;

	@UpdateDateColumn()
	lastEdited!: Date;
}
