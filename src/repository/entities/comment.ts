import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn
} from "typeorm";

@Entity()
export class Comment {
	@PrimaryGeneratedColumn()
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
