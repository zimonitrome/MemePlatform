import express from "express";
import { getRepository, Repository, Like } from "typeorm";
import { MemeTemplate } from "../repository/entities";
import whereQueryBuilder from "../helpers/whereQueryBuilder";

const router = express.Router();

router.post("/", async (request, response) => {
	// TODO: validate parameters

	try {
		const imageSource =
			"https://i.kym-cdn.com/entries/icons/mobile/000/026/913/excuse.jpg"; // temp
		const memeTemplate = new MemeTemplate(
			request.body.username,
			imageSource,
			request.body.name
		);

		const memeTemplateRepo = getRepository(MemeTemplate);
		await memeTemplateRepo.save(memeTemplate);
		response.status(204).end();
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
	try {
		const memeTemplateRepo = getRepository(MemeTemplate);
		const queries = ["name", "username"];
		const isSearch = ["name"];
		const whereQueries = whereQueryBuilder(request.query, queries, isSearch);
		const memeTemplates = await memeTemplateRepo.find({ where: whereQueries });
		response.status(200).json(memeTemplates);
	} catch (error) {
		console.error(error); // debugging
		response.status(500).json("Internal server error.");
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
		if (error.name === "EntityNotFound") {
			response.status(404).end();
		} else if (error.code === "22P02") {
			response.status(400).json({ errorMessage: "Invalid parameter(s)." });
		} else {
			response.status(500).json("Internal server error.");
		}
	}
});

router.delete("/:templateId", async (request, response) => {
	try {
		const memeTemplateRepo = getRepository(MemeTemplate);
		await memeTemplateRepo.delete({
			id: request.params.templateId
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
