import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Vote {
	constructor(vote: number, memeId: number, username: string) {
		this.vote = vote;
		this.memeId = memeId;
		this.username = username;
	}

	@Column()
	vote!: number;

	@PrimaryColumn()
	memeId!: number;

	@PrimaryColumn()
	username!: string;
}
