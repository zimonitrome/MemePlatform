import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Meme {
	@PrimaryGeneratedColumn()
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
