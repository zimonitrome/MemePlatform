import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";
import { userInfo } from "os";

@Entity()
export class Meme {
	@PrimaryColumn()
	id!: number;

	@Column()
	temlateId!: number;

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
