import express from "express";
import { getRepository, Repository, Like } from "typeorm";
import { Meme, Vote, Comment } from "../repository/entities";
import whereQueryBuilder from "../helpers/whereQueryBuilder";
import { ValidationError } from "../helpers/ValidationError";
import { authenticate } from "../helpers/authenticationHelpers";
import { createMeme } from "../helpers/memeGenerator";
import { deleteImage, pathFromUrl } from "../helpers/storageHelper";
import { defaultTakeAmount } from "../helpers/constants";

const router = express.Router();

router.post("/", async (request, response) => {
	// TODO: validate parameters

	try {
		authenticate(request.headers.authorization, request.body.username);
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
		meme.validate();

		const memeRepo = getRepository(Meme);
		const savedMeme = await memeRepo.save(meme);
		response.status(200).json(savedMeme);
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
		console.error(error); // debugging
		response.status(500).end();
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
		} else {
			response.status(500).end();
		}
	}
});

router.delete("/:memeId", async (request, response) => {
	try {
		const memeRepo = getRepository(Meme);

		const meme = await memeRepo.findOneOrFail({ id: request.params.memeId });
		authenticate(request.headers.authorization, meme.username);

		deleteImage(pathFromUrl(meme.imageSource));

		await memeRepo.update(
			{ id: request.params.memeId },
			{ imageSource: undefined, username: undefined, templateId: undefined }
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

export default router;
