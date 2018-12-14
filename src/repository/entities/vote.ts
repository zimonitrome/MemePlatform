import { Entity, Column, PrimaryColumn, getRepository } from "typeorm";
import { Meme, User } from ".";
import { CustomError } from "../../helpers/CustomError";

@Entity()
export class Vote {
	constructor(vote: number, memeId: number, username: string) {
		this.vote = vote;
		this.memeId = memeId;
		this.username = username;
	}

	async validate() {
		await Vote.validateVoteSign(this.vote);
		await Vote.validateMemeId(this.memeId);
		await Vote.validateUsername(this.username);
	}

	static validateVoteSign(vote: number) {
		if (vote === -1 || vote === 1) {
			return;
		} else {
			throw new CustomError("Vote must be -1 or 1.");
		}
	}

	static async validateMemeId(memeId: number) {
		if (memeId) {
			const memeRepo = getRepository(Meme);
			if (await memeRepo.findOne({ id: memeId })) {
				return;
			} else {
				throw new CustomError("Meme does not exist.");
			}
		} else {
			throw new CustomError("Missing parameter memeId.");
		}
	}

	static async validateUsername(username: string) {
		if (username) {
			const userRepo = getRepository(User);
			if (await userRepo.findOne({ where: { username } })) {
				return true;
			} else {
				throw new CustomError("User does not exist.");
			}
		} else {
			throw new CustomError("Missing parameter username.");
		}
	}

	@Column()
	vote!: number;

	@PrimaryColumn()
	memeId!: number;

	@PrimaryColumn()
	username!: string;
}
