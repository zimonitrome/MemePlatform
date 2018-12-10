import { createConnection } from "typeorm";
import dotenv from "dotenv";
import * as entities from "./entities";
import { rebuildDB } from "../main";
dotenv.config();

export default async () => {
	await createConnection({
		type: "postgres",
		host: process.env.DB_ENDPOINT,
		port: 5432,
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: "schpoopDB",
		synchronize: rebuildDB,
		logging: false,
		entities: [
			entities.Comment,
			entities.Meme,
			entities.MemeTemplate,
			entities.User,
			entities.Vote
		]
	}).catch(console.log);
};
