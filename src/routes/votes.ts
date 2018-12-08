import express from "express";
import { getRepository, Repository, Like } from "typeorm";
import { Vote, Meme } from "../repository/entities";
import whereQueryBuilder from "../helpers/whereQueryBuilder";
import { ValidationError } from "../helpers/ValidationError";
import { authenticate } from "../helpers/authenticationHelpers";

const router = express.Router();

router.post("/", async (request, response) => {
	try {
		authenticate(request.headers.authorization, request.body.username);
		const vote = new Vote(
			request.body.vote,
			request.body.memeId,
			request.body.username
		);
		vote.validate();

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
		if (error instanceof ValidationError) {
			response.status(400).json(error.jsonError);
		} else {
			response.status(500).end();
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
		if (error instanceof ValidationError) {
			response.status(400).json(error.jsonError);
		} else if (error.name === "EntityNotFound") {
			response.status(404).end();
		} else {
			response.status(500).end();
		}
	}
});

router.delete("/:memeId", async (request, response) => {
	try {
		const voteRepo = getRepository(Vote);
		const vote = await voteRepo.findOneOrFail({
			where: { memeId: request.params.memeId }
		});

		authenticate(request.headers.authorization, vote.username);

		await voteRepo.delete({
			memeId: request.params.memeId,
			username: vote.username
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
		if (error instanceof ValidationError) {
			response.status(400).json(error.jsonError);
		} else if (error.name === "EntityNotFound") {
			response.status(404).end();
		} else {
			response.status(500).end();
		}
	}
});

export default router;
