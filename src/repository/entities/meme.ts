import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	getRepository
} from "typeorm";
import { MemeTemplate, User, Category } from ".";

@Entity()
export class Meme {
	constructor(
		templateId: number,
		username: string,
		imageSource: string,
		categoryId?: number,
		name?: string
	) {
		// Validations
		if (templateId) {
			const templateRepo = getRepository(MemeTemplate);
			if (templateRepo.find({ where: { id: templateId } })) {
				this.templateId = templateId;
			} else {
				throw new Error("Template does not exist.");
			}
		} else {
			throw new Error("Missing parameter templateId.");
		}
		if (username) {
			const userRepo = getRepository(User);
			if (userRepo.find({ where: { username } })) {
				this.username = username;
			} else {
				throw new Error("User does not exist.");
			}
		} else {
			throw new Error("Missing parameter username.");
		}
		// Image link should always exist, errors should be thrown beforehand
		this.imageSource = imageSource;
		if (categoryId) {
			const categoryRepo = getRepository(Category);
			if (categoryRepo.find({ where: { id: categoryId } })) {
				this.categoryId = categoryId;
			} else {
				throw new Error("Category does not exist.");
			}
		}
		if (name) {
			const regexp = new RegExp(/^.{1,300}$/);
			if (regexp.test(name)) {
				this.name = name;
			} else {
				throw new Error("Given name must be between 1 and 300 characters.");
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
	categoryId?: number;

	@Column({ nullable: true })
	name?: string;

	@Column({ nullable: true })
	imageSource!: string;

	@Column()
	votes!: number;

	@CreateDateColumn()
	postDate!: Date;
}
