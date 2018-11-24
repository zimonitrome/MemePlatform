import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn
} from "typeorm";

@Entity()
export class Meme {
	constructor(
		templateId: number,
		username: string,
		imageSource: string,
		categoryId?: number,
		name?: string
	) {
		this.templateId = templateId;
		this.username = username;
		this.imageSource = imageSource;
		this.categoryId = categoryId;
		this.name = name;
		this.votes = 0;
	}

	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	templateId!: number;

	@Column()
	username!: string;

	@Column({ nullable: true })
	categoryId?: number;

	@Column({ nullable: true })
	name?: string;

	@Column()
	imageSource!: string;

	@Column()
	votes!: number;

	@CreateDateColumn()
	postDate!: Date;
}
