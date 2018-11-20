import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Vote {
	@PrimaryColumn()
	username!: string;

	@Column()
	passwordHash!: string;

	@Column()
	salt!: string;
}
