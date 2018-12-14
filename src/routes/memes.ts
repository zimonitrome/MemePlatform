import express from "express";
import { getRepository, Repository, Like } from "typeorm";
import { Meme, Vote, Comment } from "../repository/entities";
import whereQueryBuilder from "../helpers/whereQueryBuilder";
import {
	CustomError,
	customErrorResponse,
	dbErrorToCustomError
} from "../helpers/CustomError";
import { authorize } from "../helpers/authorizationHelpers";
import { createMeme } from "../helpers/memeGenerator";
import { deleteImage, pathFromUrl } from "../helpers/storageHelper";
import { defaultTakeAmount } from "../helpers/constants";

const router = express.Router();

router.post("/", async (request, response) => {
	try {
		authorize(request.headers.authorization, request.body.username);
		const imageSource = await createMeme(
			request.body.templateId,
			request.body.topText,
			request.body.bottomText
		);

		const meme = new Meme(
			request.body.templateId,
			request.body.username,
			imageSource,
			request.body.name
		);
		await meme.validate();

		const memeRepo = getRepository(Meme);
		const savedMeme = await memeRepo.save(meme);
		response.status(200).json(savedMeme);
	} catch (error) {
		customErrorResponse(response, error);
	}
});

router.get("/", async (request, response) => {
	try {
		const memeRepo = getRepository(Meme);
		const queries = ["name", "templateId", "username"];
		const isSearch = ["name"];
		const whereQueries = whereQueryBuilder(request.query, queries, isSearch);
		const pageSize = request.query.pageSize || defaultTakeAmount;
		const memes = await memeRepo.find({
			where: whereQueries,
			take: pageSize,
			skip: request.query.page * pageSize || 0
		});
		response.status(200).json(memes);
	} catch (error) {
		customErrorResponse(response, error);
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
		customErrorResponse(response, error);
	}
});

router.delete("/:memeId", async (request, response) => {
	try {
		const memeRepo = getRepository(Meme);

		const meme = await memeRepo
			.findOneOrFail({ id: request.params.memeId })
			.catch(dbErrorToCustomError);
		authorize(request.headers.authorization, meme.username);

		deleteImage(pathFromUrl(meme.imageSource));

		await memeRepo.update(
			{ id: request.params.memeId },
			{ imageSource: undefined, username: undefined, templateId: undefined }
		);

		response.status(204).end();
	} catch (error) {
		customErrorResponse(response, error);
	}
});

export default router;
