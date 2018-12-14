import { Entity, Column, PrimaryGeneratedColumn, getRepository } from "typeorm";
import { User } from ".";
import { CustomError } from "../../helpers/CustomError";

@Entity()
export class MemeTemplate {
	constructor(username: string, imageSource: string, name?: string) {
		this.username = username;
		this.imageSource = imageSource;
		this.name = name;
	}

	async validate() {
		await MemeTemplate.validateUsername(this.username);
		MemeTemplate.validateName(this.name);
	}

	static async validateUsername(username: string) {
		if (username) {
			const userRepo = getRepository(User);
			if (await userRepo.findOne({ username })) {
				return;
			} else {
				throw new CustomError("User does not exist.");
			}
		} else {
			throw new CustomError("Missing parameter username.");
		}
	}

	static validateName(name: string | undefined) {
		if (name) {
			const regexp = new RegExp(/^.{1,300}$/);
			if (regexp.test(name)) {
				return;
			} else {
				throw new CustomError(
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
