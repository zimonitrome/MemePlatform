import { Entity, Column, PrimaryColumn } from "typeorm";
import { CustomError } from "../../helpers/CustomError";

@Entity()
export class User {
	constructor(username: string, password: string) {
		this.username = username;
		this.passwordHash = password;
	}

	validate() {
		User.validateUsername(this.username);
		User.validatePassword(this.passwordHash);
	}

	static validateUsername(username: string) {
		if (username) {
			const lengthregexp = new RegExp(/^.{4,30}$/);
			if (lengthregexp.test(username)) {
				const charregexp = new RegExp(/^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/);
				if (charregexp.test(username)) {
					return;
				} else {
					throw new CustomError(
						// tslint:disable-next-line:max-line-length
						"Username can contain only '-', '_' or alphanumerical characters, and must start and end with alphanumerical characters. '-' and '_' cannot be repeated in succession."
					);
				}
			} else {
				throw new CustomError(
					"Username must be between 4 and 30 characters long."
				);
			}
		} else {
			throw new CustomError("Missing parameter username.");
		}
	}

	static validatePassword(password: string) {
		if (password) {
			const lengthregexp = new RegExp(/^.{8,30}$/);
			if (lengthregexp.test(password)) {
				const charregexp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]*$/);
				if (charregexp.test(password)) {
					return;
				} else {
					throw new CustomError(
						"Password must contain at least one letter and one number, and must only contain letters or numbers."
					);
				}
			} else {
				throw new CustomError(
					"Password must be between 8 and 30 characters long."
				);
			}
		} else {
			throw new CustomError("Missing parameter password.");
		}
	}

	@PrimaryColumn()
	username!: string;

	@Column()
	passwordHash!: string;
}
