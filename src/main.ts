import express from "express";
import memesRouter from "./routes/memes";
import categoriesRouter from "./routes/categories";
import { getConnection } from "typeorm";
import connectToDB from "./repository/dbConnection";
import insertMockData from "./repository/insertMockData";
import bodyParser from "body-parser";

const port = process.env.PORT || 80;
const app = express();

(async () => {
	await connectToDB();
	await getConnection().synchronize(true); // Extra step which empties tables, rows, indices etc.
	await insertMockData();

	app.use(bodyParser.json());
	app.use("/memes", memesRouter);
	app.use("/categories", categoriesRouter);

	app.listen(port, () => console.log(`started webserver on port: ${port}`));
})();
