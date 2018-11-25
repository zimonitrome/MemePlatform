import express from "express";
import { getRepository, Repository } from "typeorm";
import { Meme } from "../repository/entities";

const router = express.Router();

router.post("/", async (request, response) => {
	// TODO: validate parameters

	try {
		// TODO: Generate meme image here
		const imageSource = "https://i.redd.it/po71lilrehky.jpg"; // temp
		const meme = new Meme(
			request.body.templateId,
			request.body.username,
			imageSource,
			request.body.categoryId,
			request.body.name
		);

		const memeRepo = getRepository(Meme);
		const memes = await memeRepo.save(meme);
		response.status(204).end();
	} catch (error) {
		console.error(error); // debugging
		if (error.code === "23502") {
			response.status(400).json({ errorMessage: "Missing parameter(s)." });
		} else if (error.code === "22P02") {
			response.status(400).json({ errorMessage: "Invalid parameter(s)." });
		} else {
			response.status(500).json("Internal server error.");
		}
	}
});

router.get("/", async (request, response) => {
	try {
		const memeRepo = getRepository(Meme);
		const memes = await memeRepo.find();
		response.status(200).json(memes);
	} catch (error) {
		console.error(error); // debugging
		response.status(500).json("Internal server error.");
	}
});

router.get("/:memeId", async (request, response) => {
	try {
		const memeRepo = getRepository(Meme);
		const meme = await memeRepo.findOneOrFail({
			where: { id: request.params.memeId }
		});
		response.status(200).json(meme);
	} catch (error) {
		console.error(error); // debugging
		if (error.name === "EntityNotFound") {
			response.status(404).end();
		} else if (error.code === "22P02") {
			response.status(400).json({ errorMessage: "Invalid parameter(s)." });
		} else {
			response.status(500).json("Internal server error.");
		}
	}
});

export default router;
