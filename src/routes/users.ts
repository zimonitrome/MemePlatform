import express from "express";
import { getRepository, Repository, Like } from "typeorm";
import {
	User,
	Vote,
	MemeTemplate,
	Meme,
	Comment
} from "../repository/entities";
import whereQueryBuilder from "../helpers/whereQueryBuilder";
import { ValidationError } from "../helpers/ValidationError";
import { hash } from "bcrypt";
import { authenticate } from "../helpers/authenticationHelpers";

const router = express.Router();
const hashRounds = 6;

export default router;

router.post("/", async (request, response) => {
	try {
		User.validatePassword(request.body.password);
		User.validateUsername(request.body.username);

		const user = new User(
			request.body.username,
			await hash(request.body.password, hashRounds)
		);

		const userRepo = getRepository(User);
		await userRepo.save(user);
		response.status(204).end();
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
	try {
		const userRepo = getRepository(User);
		const queries = ["name"];
		const isSearch = ["name"];
		const whereQueries = whereQueryBuilder(request.query, queries, isSearch);
		const users = await userRepo.find({ where: whereQueries });
		response.status(200).json(users);
	} catch (error) {
		console.error(error); // debugging
		response.status(500).end();
	}
});

router.put("/:username", async (request, response) => {
	try {
		// TODO: Maybe update docs idk?
		authenticate(request.headers.authorization, request.params.username);

		User.validatePassword(request.body.password);
		const updatedUser = new User(
			request.params.username,
			await hash(request.body.password, hashRounds)
		);
		const userRepo = getRepository(User);
		await userRepo.update(
			{ username: request.params.username },
			{ passwordHash: updatedUser.passwordHash }
		);
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

router.delete("/:username", async (request, response) => {
	try {
		authenticate(request.headers.authorization, request.params.username);

		const userRepo = getRepository(User);
		const voteRepo = getRepository(Vote);
		const memeRepo = getRepository(Meme);
		const commentRepo = getRepository(Comment);

		await userRepo.delete({ username: request.params.username });

		// Delete all votes and updates vote count on voted memes
		const votes = await voteRepo.find({ username: request.params.username });
		await voteRepo.delete({ username: request.params.username });
		votes.forEach(async vote => {
			switch (vote.vote) {
				case -1:
					await memeRepo.increment({ id: vote.memeId }, "votes", 1);
					break;
				case 1:
					await memeRepo.decrement({ id: vote.memeId }, "votes", 1);
					break;
			}
		});

		// Delete all templates made by the user and "blanks" memes made from template
		const templateRepo = getRepository(MemeTemplate);
		const templateMemes = await memeRepo.find({
			templateId: request.params.templateId
		});
		await templateRepo.delete({ username: request.params.username });
		templateMemes.forEach(async meme => {
			memeRepo.update({ id: meme.id }, { templateId: undefined });
		});

		// "Blanks" memes made by the user
		const userMemes = await memeRepo.find({
			where: { username: request.params.username }
		});
		userMemes.forEach(async meme => {
			memeRepo.update(
				{ id: meme.id },
				{ username: undefined, imageSource: undefined }
			);
		});

		// "Blanks" comments made by the user
		const comments = await commentRepo.find({
			where: { username: request.params.username }
		});
		comments.forEach(async comment => {
			commentRepo.update(
				{ id: comment.id },
				{ username: undefined, text: undefined }
			);
		});

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
