import { Entity, Column, PrimaryColumn, getRepository } from "typeorm";
import { Meme, User } from ".";
import { ValidationError } from "../../helpers/ValidationError";

@Entity()
export class Vote {
	constructor(vote: number, memeId: number, username: string) {
		this.vote = vote;
		this.memeId = memeId;
		this.username = username;
	}

	validate() {
		Vote.validateVoteSign(this.vote);
		Vote.validateMemeId(this.memeId);
		Vote.validateUsername(this.username);
	}

	static validateVoteSign(vote: number) {
		if (vote === -1 || vote === 1) {
			return;
		} else {
			throw new ValidationError("Vote must be -1 or 1.");
		}
	}

	static validateMemeId(memeId: number) {
		if (memeId) {
			const memeRepo = getRepository(Meme);
			if (memeRepo.find({ where: { id: memeId } })) {
				return;
			} else {
				throw new ValidationError("Meme does not exist.");
			}
		} else {
			throw new ValidationError("Missing parameter memeId.");
		}
	}

	static validateUsername(username: string) {
		if (username) {
			const userRepo = getRepository(User);
			if (userRepo.find({ where: { username } })) {
				return true;
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
