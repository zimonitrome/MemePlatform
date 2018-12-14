import { createConnection } from "typeorm";
import * as entities from "./entities";

export default async () => {
	await createConnection({
		type: "postgres",
		host: process.env.DB_ENDPOINT,
		port: 5432,
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: "schpoopDB",
		synchronize: false,
		logging: false,
		entities: [
			entities.Comment,
			entities.Meme,
			entities.MemeTemplate,
			entities.User,
			entities.Vote
		]
	});
};
