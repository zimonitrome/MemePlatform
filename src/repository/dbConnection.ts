import { createConnection } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

createConnection({
	type: "postgres",
	host: "localhost",
	port: 3306,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_ENDPOINT,
	synchronize: true,
	logging: false,
	entities: ["./entities/**/*.ts"]
});
