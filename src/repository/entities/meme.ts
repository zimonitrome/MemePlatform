import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn
} from "typeorm";

@Entity()
export class Meme {
	@PrimaryGeneratedColumn()
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
