import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	getRepository
} from "typeorm";
import { MemeTemplate, User } from ".";
import { ValidationError } from "../../helpers/ValidationError";

@Entity()
export class Meme {
	constructor(
		templateId: number,
		username: string,
		imageSource: string,
		name?: string
	) {
		this.templateId = templateId;
		this.username = username;
		this.imageSource = imageSource;
		this.name = name;
		this.votes = 0;
	}

	validate() {
		Meme.validateName(this.name);
		Meme.validateTemplateId(this.templateId);
		Meme.validateUsername(this.username);
	}

	static validateTemplateId(templateId: number) {
		if (templateId) {
			const templateRepo = getRepository(MemeTemplate);
			if (templateRepo.find({ where: { id: templateId } })) {
				return;
			} else {
				throw new ValidationError("Template does not exist.");
			}
		} else {
			throw new ValidationError("Missing parameter templateId.");
		}
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
	templateId!: number;

	@Column({ nullable: true })
	username!: string;

	@Column({ nullable: true })
	name?: string;

	@Column({ nullable: true })
	imageSource!: string;

	@Column()
	votes!: number;

	@CreateDateColumn()
	postDate!: Date;
}
