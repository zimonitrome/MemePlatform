import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	getRepository
} from "typeorm";
import { MemeTemplate, User } from ".";
import { CustomError } from "../../helpers/CustomError";
import getHotness from "./../../helpers/hotness";

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
		this.hotness = getHotness(this.votes, new Date());
	}

	async validate() {
		await Meme.validateName(this.name);
		await Meme.validateTemplateId(this.templateId);
		await Meme.validateUsername(this.username);
	}

	static async validateTemplateId(templateId: number) {
		if (templateId) {
			const templateRepo = getRepository(MemeTemplate);
			if (await templateRepo.findOne({ id: templateId })) {
				return;
			} else {
				throw new CustomError("Template does not exist.");
			}
		} else {
			throw new CustomError("Missing parameter templateId.");
		}
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
	templateId!: number;

	@Column({ nullable: true })
	username!: string;

	@Column({ nullable: true })
	name?: string;

	@Column({ nullable: true })
	imageSource!: string;

	@Column()
	votes!: number;

	@Column({ type: "float" })
	hotness!: number;

	@CreateDateColumn()
	postDate!: Date;
}
