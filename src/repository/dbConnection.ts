import { createConnection } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

export default async () => {
	await createConnection({
		type: "postgres",
		host: process.env.DB_ENDPOINT,
		port: 5432,
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: "schpoopDB",
		synchronize: true,
		logging: false,
		entities: ["./src/repository/entities/**/*.ts"]
	}).catch(error => console.log(error));
};
