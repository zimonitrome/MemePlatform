import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
	constructor(name: string) {
		this.name = name;
	}

	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name!: string;
}
