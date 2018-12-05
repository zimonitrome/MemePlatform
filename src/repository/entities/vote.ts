import { Entity, Column, PrimaryColumn, getRepository } from "typeorm";
import { Meme, User } from ".";
import { ValidationError } from "../../helpers/ValidationError";

@Entity()
export class Vote {
	constructor(vote: number, memeId: number, username: string) {
		if (vote === -1 || vote === 1) {
			this.vote = vote;
		} else {
			throw new ValidationError("Vote must be -1 or 1.");
		}
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
	}

	@Column()
	vote!: number;

	@PrimaryColumn()
	memeId!: number;

	@PrimaryColumn()
	username!: string;
}
