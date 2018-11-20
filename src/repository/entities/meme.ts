import { Entity, Column } from "typeorm";

@Entity()
export class Meme {
	@Column()
	id!: number;

	@Column()
	temlateId!: number;

	@Column()
	username!: string;

	@Column()
	categoryId?: number;

	@Column()
	name?: string;

	@Column()
	imageSource!: string;

	@Column()
	votes!: number;

	@Column()
	postDate!: number;
}
