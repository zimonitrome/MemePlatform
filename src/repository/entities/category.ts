import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Vote {
	@PrimaryColumn()
	id!: number;

	@Column()
	name!: string;
}
