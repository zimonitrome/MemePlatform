import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Vote {
	@Column()
	vote!: number;

	@PrimaryColumn()
	memeId!: number;

	@PrimaryColumn()
	username!: string;
}
