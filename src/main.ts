import express from "express";
import memesRouter from "./routes/memes";
import usersRouter from "./routes/users";
import memeTemplatesRouter from "./routes/memetemplates";
import votesRouter from "./routes/votes";
import commentsRouter from "./routes/comments";
import { getConnection } from "typeorm";
import connectToDB from "./repository/dbConnection";
import insertMockData from "./repository/insertMockData";
import bodyParser from "body-parser";

Error.stackTraceLimit = Infinity;
const port = process.env.PORT || 80;
const app = express();

(async () => {
	await connectToDB();
	getConnection();
	await insertMockData();

	app.use(bodyParser.json());
	app.use(bodyParser.text()); // for where entire body is parsed as single value
	app.use("/memes", memesRouter);
	app.use("/users", usersRouter);
	app.use("/votes", votesRouter);
	app.use("/memetemplates", memeTemplatesRouter);
	app.use("/comments", commentsRouter);

	app.listen(port, () => console.log(`started webserver on port: ${port}`));
})();
