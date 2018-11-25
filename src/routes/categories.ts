import express from "express";
import { getRepository, Repository, Like } from "typeorm";
import { Category } from "../repository/entities";
import whereQueryBuilder from "../helpers/whereQueryBuilder";

const router = express.Router();

router.post("/", async (request, response) => {
	// TODO: validate parameters

	try {
		const category = new Category(request.body.name);
		const categoryRepo = getRepository(Category);
		await categoryRepo.save(category);
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
		const categoryRepo = getRepository(Category);
		const queries = ["name"];
		const isSearch = ["name"];
		const whereQueries = whereQueryBuilder(request.query, queries, isSearch);
		const categories = await categoryRepo.find({ where: whereQueries });
		response.status(200).json(categories);
	} catch (error) {
		console.error(error); // debugging
		response.status(500).json("Internal server error.");
	}
});

export default router;
