import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryColumn()
	username!: string;

	@Column()
	passwordHash!: string;

	@Column()
	salt!: string;
}
