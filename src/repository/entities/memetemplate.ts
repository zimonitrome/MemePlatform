import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MemeTemplate {
	constructor(username: string, imageSource: string, name?: string) {
		this.username = username;
		this.imageSource = imageSource;
		this.name = name;
	}

	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	username!: string;

	@Column()
	imageSource!: string;

	@Column({ nullable: true })
	name?: string;
}
