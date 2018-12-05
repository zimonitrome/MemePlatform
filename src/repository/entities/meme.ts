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
		// Validations
		if (templateId) {
			const templateRepo = getRepository(MemeTemplate);
			if (templateRepo.find({ where: { id: templateId } })) {
				this.templateId = templateId;
			} else {
				throw new ValidationError("Template does not exist.");
			}
		} else {
			throw new ValidationError("Missing parameter templateId.");
		}
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
		// Image link should always exist, ValidationErrors should be thrown beforehand
		this.imageSource = imageSource;
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
		this.votes = 0;
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
