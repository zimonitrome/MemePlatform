import express from "express";
import { getRepository, Repository, Like } from "typeorm";
import { Vote } from "../repository/entities";
import whereQueryBuilder from "../helpers/whereQueryBuilder";

const router = express.Router();

router.post("/", async (request, response) => {
	// TODO: validate parameters

	try {
		const username = "Voldemorph"; // TODO: get username of signed in user.
		const vote = new Vote(
			Math.sign(request.body.vote),
			request.body.memeId,
			username
		);
		const voteRepo = getRepository(Vote);
		await voteRepo.save(vote);
		response.status(200).end();
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
