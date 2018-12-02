import express from "express";
import { getRepository, Repository, Like } from "typeorm";
import { Vote, Meme } from "../repository/entities";
import whereQueryBuilder from "../helpers/whereQueryBuilder";

const router = express.Router();

router.post("/", async (request, response) => {
	// TODO: validate parameters

	try {
		const username = "Voldemorph"; // TODO: get username of signed in user.
		const vote = new Vote(request.body.vote, request.body.memeId, username);
		// TODO: Also update votes on the meme
		const voteRepo = getRepository(Vote);
		await voteRepo.save(vote);

		const memeRepo = getRepository(Meme);
		await memeRepo.update(
			{ id: request.body.memeId },
			{ votes: +request.body.vote }
		);

		response.status(200).json(vote);
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
	// TODO: validate parameters, require both memeId and username
	try {
		const voteRepo = getRepository(Vote);
		const queries = ["memeId", "username"];
		const whereQueries = whereQueryBuilder(request.query, queries);
		const vote = await voteRepo.find({ where: whereQueries });
		response.status(200).json(vote);
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
		const voteRepo = getRepository(Vote);
		const user = "Voldemorph"; // TODO: get username of signed in user.

		const memeRepo = getRepository(Meme);
		const vote = await voteRepo.find({
			select: ["vote"],
			where: { memeId: request.params.memeId }
		});

		const voteSign = vote[0];
		await memeRepo.update({ id: request.params.memeId }, { votes: -voteSign });

		await voteRepo.delete({
			memeId: request.params.memeId,
			username: user
		});

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
