import { Entity, Column } from "typeorm";

@Entity()
export class Vote {
	@Column()
	vote!: number;

	@Column()
	memeId!: number;

	@Column()
	username!: string;
}
