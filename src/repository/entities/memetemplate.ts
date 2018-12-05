import { Entity, Column, PrimaryGeneratedColumn, getRepository } from "typeorm";
import { User } from ".";
import { ValidationError } from "../../helpers/ValidationError";

@Entity()
export class MemeTemplate {
	constructor(username: string, imageSource: string, name?: string) {
		this.username = username;
		this.imageSource = imageSource; // Add validation to check that image exists
		this.name = name;
	}

	validate() {
		MemeTemplate.validateUsername(this.username);
		MemeTemplate.validateName(this.name);
	}

	static validateUsername(username: string) {
		if (username) {
			const userRepo = getRepository(User);
			if (userRepo.find({ where: { username } })) {
				return;
			} else {
				throw new ValidationError("User does not exist.");
			}
		} else {
			throw new ValidationError("Missing parameter username.");
		}
	}

	static validateName(name: string | undefined) {
		if (name) {
			const regexp = new RegExp(/^.{1,300}$/);
			if (regexp.test(name)) {
				return;
			} else {
				throw new ValidationError(
					"Given name must be between 1 and 300 characters."
				);
			}
		} else {
			return;
		}
	}

	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ nullable: true })
	username!: string;

	@Column({ nullable: true })
	imageSource!: string;

	@Column({ nullable: true })
	name?: string;
}
