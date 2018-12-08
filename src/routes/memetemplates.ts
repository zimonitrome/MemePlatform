import express from "express";
import { getRepository, Repository, Like, IsNull } from "typeorm";
import { MemeTemplate, Meme } from "../repository/entities";
import whereQueryBuilder from "../helpers/whereQueryBuilder";
import { ValidationError } from "../helpers/ValidationError";
import { authenticate } from "../helpers/authenticationHelpers";

const router = express.Router();

router.post("/", async (request, response) => {
	// TODO: validate parameters

	try {
		authenticate(request.headers.authorization, request.body.username);

		const imageSource =
			"https://i.kym-cdn.com/entries/icons/mobile/000/026/913/excuse.jpg"; // TODO: temp
		const memeTemplate = new MemeTemplate(
			request.body.username,
			imageSource,
			request.body.name
		);
		memeTemplate.validate();
		const memeTemplateRepo = getRepository(MemeTemplate);
		const savedTemplate = await memeTemplateRepo.save(memeTemplate);
		response.status(200).json(savedTemplate);
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
		const memeTemplateRepo = getRepository(MemeTemplate);
		const queries = ["name", "username"];
		const isSearch = ["name"];
		const whereQueries = whereQueryBuilder(request.query, queries, isSearch);
		const memeTemplates = await memeTemplateRepo.find({ where: whereQueries });
		response.status(200).json(memeTemplates);
	} catch (error) {
		console.error(error); // debugging
		response.status(500).end();
	}
});

router.get("/:templateId", async (request, response) => {
	try {
		const memeTemplateRepo = getRepository(MemeTemplate);
		const memeTemplate = await memeTemplateRepo.findOneOrFail({
			where: { id: request.params.templateId }
		});
		response.status(200).json(memeTemplate);
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

router.delete("/:templateId", async (request, response) => {
	try {
		const memeTemplateRepo = getRepository(MemeTemplate);
		const memeTemplate = await memeTemplateRepo.findOneOrFail({
			id: request.params.templateId
		});
		authenticate(request.headers.authorization, memeTemplate.username);

		// "Blanks" templateId in all memes made from template
		const memeRepo = getRepository(Meme);
		const memes = await memeRepo.find({
			templateId: request.params.templateId
		});
		memes.forEach(async meme => {
			memeRepo.update({ id: meme.id }, { templateId: undefined });
		});

		await memeTemplateRepo.delete({ id: request.params.templateId });

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
