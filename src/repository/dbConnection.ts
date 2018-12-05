import { createConnection } from "typeorm";
import dotenv from "dotenv";
import * as entities from "./entities";
dotenv.config();

export default async () => {
	console.log("connects to db");
	await createConnection({
		type: "postgres",
		host: process.env.DB_ENDPOINT,
		port: 5432,
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: "schpoopDB",
		synchronize: true,
		logging: false,
		entities: [
			entities.Comment,
			entities.Meme,
			entities.MemeTemplate,
			entities.User,
			entities.Vote
		] // ["../repository/entities/**/*.ts"]
	}).catch(error => console.log(error));
};
