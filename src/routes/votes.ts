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

		const voteRepo = getRepository(Vote);
		await voteRepo.save(vote);

		// Also updates votecount on meme
		const memeRepo = getRepository(Meme);

		switch (vote.vote) {
			case 1:
				await memeRepo.increment({ id: vote.memeId }, "votes", 1);
				break;
			case -1:
				await memeRepo.decrement({ id: vote.memeId }, "votes", 1);
				break;
		}
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
		const user = "Voldemorph"; // TODO: get username of signed in user.

		const voteRepo = getRepository(Vote);
		const vote = await voteRepo.findOneOrFail({
			where: { memeId: request.params.memeId }
		});
		await voteRepo.delete({
			memeId: request.params.memeId,
			username: user
		});

		const memeRepo = getRepository(Meme);
		switch (vote.vote) {
			case -1:
				await memeRepo.increment({ id: vote.memeId }, "votes", 1);
				break;
			case 1:
				await memeRepo.decrement({ id: vote.memeId }, "votes", 1);
				break;
		}

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
