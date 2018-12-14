import dotenv from "dotenv";
dotenv.config();
import express from "express";
import memesRouter from "./routes/memes";
import usersRouter from "./routes/users";
import memeTemplatesRouter from "./routes/memetemplates";
import votesRouter from "./routes/votes";
import commentsRouter from "./routes/comments";
import sessionsRouter from "./routes/sessions";
import { getConnection } from "typeorm";
import connectToDB from "./repository/dbConnection";
import bodyParser, { urlencoded } from "body-parser";

const port = process.env.PORT || 80;
const app = express();

(async () => {
	await connectToDB();
	await getConnection();

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use("/memes", memesRouter);
	app.use("/users", usersRouter);
	app.use("/votes", votesRouter);
	app.use("/memetemplates", memeTemplatesRouter);
	app.use("/comments", commentsRouter);
	app.use("/sessions", sessionsRouter);

	app.listen(port, () => console.log(`started webserver on port: ${port}`));
})();
