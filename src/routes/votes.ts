import express from "express";
import { getRepository, Repository, Like } from "typeorm";
import { Vote, Meme } from "../repository/entities";
import whereQueryBuilder from "../helpers/whereQueryBuilder";
import {
	CustomError,
	customErrorResponse,
	dbErrorToCustomError
} from "../helpers/CustomError";
import { authorize } from "../helpers/authorizationHelpers";
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from "constants";

const router = express.Router();

router.put("/:memeId", async (request, response) => {
	try {
		authorize(request.headers.authorization, request.body.username);
		const vote = new Vote(
			request.body.vote,
			request.params.memeId,
			request.body.username
		);
		await vote.validate();

		const voteRepo = getRepository(Vote);
		const existingVote = await voteRepo.findOne({
			memeId: request.params.memeId,
			username: request.body.username
		});

		const memeRepo = getRepository(Meme);

		// Forced to split vote save due to typeorm/PostgreSQL bug
		if (existingVote) {
			await voteRepo.update(
				{ memeId: vote.memeId, username: vote.username },
				vote
			);
			if (existingVote.vote === vote.vote) {
				throw new CustomError("Vote like this already exists.");
			}
			// Also updates votecount on meme
			switch (vote.vote) {
				case 1:
					await memeRepo.increment({ id: vote.memeId }, "votes", 2);
					break;
				case -1:
					await memeRepo.decrement({ id: vote.memeId }, "votes", 2);
					break;
			}
		} else {
			await voteRepo.save(vote);
			// Also updates votecount on meme
			switch (vote.vote) {
				case 1:
					await memeRepo.increment({ id: vote.memeId }, "votes", 1);
					break;
				case -1:
					await memeRepo.decrement({ id: vote.memeId }, "votes", 1);
					break;
			}
		}
		response.status(200).json(vote);
	} catch (error) {
		customErrorResponse(response, error);
	}
});

router.get("/:memeId", async (request, response) => {
	try {
		Vote.validateMemeId(request.params.memeId);
		Vote.validateUsername(request.query.username);

		const voteRepo = getRepository(Vote);

		const vote = await voteRepo
			.findOneOrFail({
				memeId: request.params.memeId,
				username: request.query.username
			})
			.catch(dbErrorToCustomError);
		response.status(200).json(vote);
	} catch (error) {
		customErrorResponse(response, error);
	}
});

router.delete("/:memeId", async (request, response) => {
	try {
		const voteRepo = getRepository(Vote);

		authorize(request.headers.authorization, request.body.username);

		const vote = await voteRepo
			.findOneOrFail({
				where: {
					memeId: request.params.memeId,
					username: request.body.username
				}
			})
			.catch(dbErrorToCustomError);

		await voteRepo
			.delete({
				memeId: request.params.memeId,
				username: request.body.username
			})
			.catch(dbErrorToCustomError);

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
		customErrorResponse(response, error);
	}
});

export default router;
