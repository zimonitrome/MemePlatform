import express from "express";
import { getRepository, Repository, Like } from "typeorm";
import { Comment } from "../repository/entities";
import whereQueryBuilder from "../helpers/whereQueryBuilder";

const router = express.Router();

router.post("/", async (request, response) => {
	// TODO: validate parameters

	try {
		const comment = new Comment(
			request.body.memeId,
			request.body.username,
			request.body.text,
			request.body.parentCommentId
		);

		const commentRepo = getRepository(Comment);
		await commentRepo.save(comment);
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

router.get("/:memeId", async (request, response) => {
	try {
		const commentRepo = getRepository(Comment);
		const comments = await commentRepo.find({
			where: { memeId: request.params.memeId }
		});
		response.status(200).json(comments);
	} catch (error) {
		console.error(error); // debugging
		// TODO: which one to check
		if (error.name === "EntityNotFound") {
			response.status(404).end();
		} else if (error.code === "22P02") {
			response.status(400).json({ errorMessage: "Invalid parameter(s)." });
		} else {
			response.status(500).json("Internal server error.");
		}
	}
});

router.put("/:commentId", async (request, response) => {
	// TODO: validate parameters

	try {
		const commentRepo = getRepository(Comment);
		// TODO: either change documentation to state that this consumes text and not json or send in a { text: "newcomment" } instead
		await commentRepo.update(
			{ id: request.params.commentId },
			{ text: request.body }
		);
		response.status(204).end();
	} catch (error) {
		console.error(error); // debugging
		if (error.name === "EntityNotFound") {
			response.status(404).end();
		} else if (error.code === "23502") {
			response.status(400).json({ errorMessage: "Missing parameter(s)." });
		} else if (error.code === "22P02") {
			response.status(400).json({ errorMessage: "Invalid parameter(s)." });
		} else {
			response.status(500).json("Internal server error.");
		}
	}
});

router.delete("/:commentId", async (request, response) => {
	try {
		const commentRepo = getRepository(Comment);
		await commentRepo.delete({ id: request.params.commentId });
		response.status(204).end();
	} catch (error) {
		console.error(error); // debugging
		// TODO: which one to check
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