import { Entity, Column, PrimaryColumn } from "typeorm";
import { ValidationError } from "../../helpers/ValidationError";

@Entity()
export class User {
	constructor(username: string, password: string) {
		if (username) {
			const lengthregexp = new RegExp(/^.{4,30}$/);
			if (lengthregexp.test(username)) {
				const charregexp = new RegExp(/^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/);
				if (charregexp.test(username)) {
					this.username = username;
				} else {
					throw new ValidationError(
						// tslint:disable-next-line:max-line-length
						"Username can contain only '-', '_' or alphanumerical characters, and must start and end with alphanumerical characters. '-' and '_' cannot be repeated in succession."
					);
				}
			} else {
				throw new ValidationError(
					"Username must be between 4 and 30 characters long."
				);
			}
		} else {
			throw new ValidationError("Missing parameter username.");
		}

		if (password) {
			const lengthregexp = new RegExp(/^.{8,30}$/);
			if (lengthregexp.test(password)) {
				const charregexp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]*$/);
				if (charregexp.test(password)) {
					// TODO: Hash password
					this.passwordHash = password;
					// TODO: Generate salt
					this.salt = "5123sdfdsf";
				} else {
					throw new ValidationError(
						"Password must contain at least one letter and one number."
					);
				}
			} else {
				throw new ValidationError(
					"Password must be between 8 and 30 characters long."
				);
			}
		} else {
			throw new ValidationError("Missing parameter password.");
		}
	}

	@PrimaryColumn()
	username!: string;

	@Column()
	passwordHash!: string;

	@Column()
	salt!: string;
}
