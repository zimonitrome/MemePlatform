import express from "express";
import memesRouter from "./routes/memes";
import { getConnection } from "typeorm";
import connectToDB from "./repository/dbConnection";
import insertMockData from "./repository/insertMockData";

const port = process.env.PORT || 80;
const app = express();

(async () => {
	await connectToDB();
	await getConnection().synchronize(true);
	await insertMockData();

	app.use("/memes", memesRouter);
	app.listen(port, () => console.log(`started webserver on port: ${port}`));
})();
