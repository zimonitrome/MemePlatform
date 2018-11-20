import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MemeTemplate {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	username!: string;

	@Column()
	imageSource!: string;

	@Column({ nullable: true })
	name?: string;
}
