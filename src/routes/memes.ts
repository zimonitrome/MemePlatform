import express from "express";
import { getRepository } from "typeorm";
import { Meme } from "../repository/entities";

const router = express.Router();

router.get("/", async (request, response) => {
	const memeRepo = getRepository(Meme);
	const memes = await memeRepo.find();
	// const memes = await memeRepo.createQueryBuilder("meme").getMany();
	response.status(200).json(memes);
});

router.get("/:memeId", async (request, response) => {
	const memeRepo = getRepository(Meme);
	const memes = await memeRepo.find({
		where: { id: request.params.memeId }
	});
	if (memes.length > 0) {
		response.status(200).json(memes[0]);
	} else {
		response.status(404);
	}
});

export default router;
