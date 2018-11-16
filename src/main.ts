import * as express from "express";

const app = express();

app.get("/memes", (request, response) => {
	response.status(200).json({ namn: "Flyckt", Age: 12 });
});

app.listen(80);
