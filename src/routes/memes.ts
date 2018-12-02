import express from "express";
import { getRepository, Repository, Like } from "typeorm";
import { Meme, Vote, Comment } from "../repository/entities";
import whereQueryBuilder from "../helpers/whereQueryBuilder";

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
		await memeRepo.save(meme);
		response.status(200).json(meme);
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
		const queries = ["name", "templateId", "username", "categoryId"];
		const isSearch = ["name"];
		const whereQueries = whereQueryBuilder(request.query, queries, isSearch);
		const memes = await memeRepo.find({ where: whereQueries });
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

router.delete("/:memeId", async (request, response) => {
	try {
		const memeRepo = getRepository(Meme);
		await memeRepo.delete({ id: request.params.memeId });

		const voteRepo = getRepository(Vote);
		await voteRepo.delete({ memeId: request.params.memeId });

		const commentRepo = getRepository(Comment);
		await commentRepo.delete({ memeId: request.params.memeId });

		response.status(204).end();
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
