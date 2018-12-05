import { Entity, Column, PrimaryGeneratedColumn, getRepository } from "typeorm";
import { User } from ".";
import { ValidationError } from "../../helpers/ValidationError";

@Entity()
export class MemeTemplate {
	constructor(username: string, imageSource: string, name?: string) {
		if (username) {
			const userRepo = getRepository(User);
			if (userRepo.find({ where: { username } })) {
				this.username = username;
			} else {
				throw new ValidationError("User does not exist.");
			}
		} else {
			throw new ValidationError("Missing parameter username.");
		}
		this.imageSource = imageSource; // Add validation to check that image exists
		if (name) {
			const regexp = new RegExp(/^.{1,300}$/);
			if (regexp.test(name)) {
				this.name = name;
			} else {
				throw new ValidationError(
					"Given name must be between 1 and 300 characters."
				);
			}
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
