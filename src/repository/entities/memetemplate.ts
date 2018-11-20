import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";

@Entity()
export class MemeTemplate {
	@PrimaryColumn()
	id!: number;

	@Column()
	username!: string;

	@Column()
	imageSource!: string;

	@Column({ nullable: true })
	name?: string;
}
