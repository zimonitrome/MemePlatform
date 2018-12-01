import { Entity, Column, PrimaryColumn, getRepository } from "typeorm";
import { Meme, User } from ".";

@Entity()
export class Vote {
	constructor(vote: number, memeId: number, username: string) {
		if (vote === -1 || vote === 1) {
			this.vote = vote;
		} else {
			throw new Error("Vote must be -1 or 1.");
		}
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
	}

	@Column()
	vote!: number;

	@PrimaryColumn()
	memeId!: number;

	@PrimaryColumn()
	username!: string;
}
