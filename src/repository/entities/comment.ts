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
		this.memeId = memeId;
		this.username = username;
		this.text = text;
		this.parentCommentId = parentCommentId;
	}

	async validate() {
		await Comment.validateMemeId(this.memeId);
		await Comment.validateParentCommentId(this.parentCommentId);
		await Comment.validateText(this.text);
		await Comment.validateUsername(this.username);
	}

	static async validateMemeId(memeId: number) {
		if (memeId) {
			const memeRepo = getRepository(Meme);
			if (await memeRepo.findOne({ id: memeId })) {
				return;
			} else {
				throw new ValidationError("Meme does not exist.");
			}
		} else {
			throw new ValidationError("Missing parameter memeId.");
		}
	}

	static async validateUsername(username: string) {
		if (username) {
			const userRepo = getRepository(User);
			if (await userRepo.findOne({ where: { username } })) {
				return;
			} else {
				throw new ValidationError("User does not exist.");
			}
		} else {
			throw new ValidationError("Missing parameter username.");
		}
	}

	static async validateParentCommentId(parentCommentId: number | undefined) {
		if (parentCommentId) {
			const commentRepo = getRepository(Comment);
			if (await commentRepo.findOne({ where: { id: parentCommentId } })) {
				return;
			} else {
				throw new ValidationError("Parent comment does not exist.");
			}
		} else {
			return;
		}
	}

	static validateText(text: string) {
		if (text) {
			const regexp = new RegExp(/^[\s\S]{1,3000}$/);
			if (regexp.test(text)) {
				return;
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
