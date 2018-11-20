import express from "express";
import memesRouter from "./routes/memes";
const app = express();

app.use("/memes", memesRouter);

app.listen(80);
