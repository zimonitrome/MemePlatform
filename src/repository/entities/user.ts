import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class User {
	constructor(username: string, passwordHash: string, salt: string) {
		if (username) {
			const lenregexp = new RegExp(/^.{4,30}$/);
			if (lenregexp.test(username)) {
				const charregexp = new RegExp(/^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/);
				if (charregexp.test(username)) {
					this.username = username;
				} else {
					throw new Error(
						// tslint:disable-next-line:max-line-length
						"Username can contain only '-', '_' or alphanumerical characters, and must start and end with alphanumerical characters. '-' and '_' cannot be repeated in succession."
					);
				}
			} else {
				throw new Error("Username must be between 4 and 30 characters long.");
			}
		} else {
			throw new Error("Missing parameter username.");
		}
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
