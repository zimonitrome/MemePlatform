import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class User {
	constructor(username: string, passwordHash: string, salt: string) {
		this.username = username;
		this.passwordHash = passwordHash;
		this.salt = salt;
	}

	@PrimaryColumn()
	username!: string;

	@Column()
	passwordHash!: string;

	@Column()
	salt!: string;
}
