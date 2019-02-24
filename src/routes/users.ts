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
import {
	CustomError,
	customErrorResponse,
	dbErrorToCustomError
} from "../helpers/CustomError";
import { hash } from "bcrypt";
import { authorize } from "../helpers/authorizationHelpers";
import { deleteImage, pathFromUrl } from "../helpers/storageHelper";
import { defaultTakeAmount } from "../helpers/constants";

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

		if (await userRepo.findOne({ username: request.body.username })) {
			throw new CustomError("User already exists", 409);
		}

		await userRepo.save(user);
		response.status(201).end();
	} catch (error) {
		customErrorResponse(response, error);
	}
});

router.get("/", async (request, response) => {
	try {
		const userRepo = getRepository(User);
		const queries = ["username"];
		const isSearch = ["username"];
		const whereQueries = whereQueryBuilder(request.query, queries, isSearch);
		const pageSize = request.query.pageSize || defaultTakeAmount;
		const users = await userRepo.find({
			where: whereQueries,
			take: pageSize,
			skip: request.query.page * pageSize || 0
		});
		response.status(200).json(users.map(user => user.username));
	} catch (error) {
		customErrorResponse(response, error);
	}
});

router.patch("/:username", async (request, response) => {
	try {
		authorize(request.headers.authorization, request.params.username);

		User.validatePassword(request.body.password);
		const updatedUser = new User(
			request.params.username,
			await hash(request.body.password, hashRounds)
		);
		const userRepo = getRepository(User);
		await userRepo
			.update(
				{ username: request.params.username },
				{ passwordHash: updatedUser.passwordHash }
			)
			.catch(dbErrorToCustomError);
		response.status(204).end();
	} catch (error) {
		customErrorResponse(response, error);
	}
});

router.delete("/:username", async (request, response) => {
	try {
		authorize(request.headers.authorization, request.params.username);

		const userRepo = getRepository(User);
		const voteRepo = getRepository(Vote);
		const memeRepo = getRepository(Meme);
		const commentRepo = getRepository(Comment);

		// Removes user from database
		await userRepo
			.delete({ username: request.params.username })
			.catch(dbErrorToCustomError);

		// Delete all votes from user
		// Also updates votecount on all memes user voted on
		{
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
		}

		// Removes templates made by the user
		{
			const templateRepo = getRepository(MemeTemplate);
			// Remove all template images crated by user
			const templates = await templateRepo.find({
				where: { username: request.params.username }
			});
			templates.forEach(template => {
				deleteImage(pathFromUrl(template.imageSource));
			});
			// Blanks templateId on all the memes made using user's templates
			const templateMemes = await memeRepo.find({
				templateId: request.params.templateId
			});
			templateMemes.forEach(async meme => {
				memeRepo.update({ id: meme.id }, { templateId: undefined });
			});
			// Deletes all templates
			await templateRepo.delete({ username: request.params.username });
		}

		// Blanks all memes made by user
		{
			const userMemes = await memeRepo.find({
				where: { username: request.params.username }
			});
			userMemes.forEach(meme => {
				deleteImage(pathFromUrl(meme.imageSource));
			});
			userMemes.forEach(async meme => {
				memeRepo.update(
					{ id: meme.id },
					{ username: undefined, imageSource: undefined }
				);
			});
		}

		// Blanks comments made by the user
		{
			const comments = await commentRepo.find({
				where: { username: request.params.username }
			});
			comments.forEach(async comment => {
				commentRepo.update(
					{ id: comment.id },
					{ username: undefined, text: undefined }
				);
			});
		}

		response.status(204).end();
	} catch (error) {
		customErrorResponse(response, error);
	}
});
