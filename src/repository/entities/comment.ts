import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Comment {
	@PrimaryColumn()
	id!: number;

	@Column()
	memeId!: number;

	@Column()
	username!: string;

	@Column()
	categoryId!: number;

	@Column({ nullable: true })
	name?: string;

	@Column()
	imageSource!: string;

	@Column()
	votes!: number;

	@CreateDateColumn()
	postDate!: Date;
}
