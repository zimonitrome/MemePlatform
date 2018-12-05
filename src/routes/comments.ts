import express from "express";
import { getRepository, Repository, Like } from "typeorm";
import { Comment } from "../repository/entities";
import whereQueryBuilder from "../helpers/whereQueryBuilder";
import { ValidationError } from "../helpers/ValidationError";

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
		comment.validate();
		const commentRepo = getRepository(Comment);
		const savedComment = await commentRepo.save(comment);
		response.status(200).json(savedComment);
	} catch (error) {
		console.error(error); // debugging
		if (error instanceof ValidationError) {
			response.status(400).json(error.jsonError);
		} else {
			response.status(500).end();
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
		if (error instanceof ValidationError) {
			response.status(400).json(error.jsonError);
		} else if (error.name === "EntityNotFound") {
			response.status(404).end();
		} else {
			response.status(500).end();
		}
	}
});

router.put("/:commentId", async (request, response) => {
	try {
		const commentRepo = getRepository(Comment);
		// tslint:disable-next-line:max-line-length
		// TODO: change documentation to state that this consumes a { text: "newcomment" } instead

		Comment.validateText(request.body.text);
		await commentRepo.update(
			{ id: request.params.commentId },
			{ text: request.body.text }
		);
		const updatedComment = await commentRepo.findOneOrFail({
			id: request.params.commentId
		});
		response.status(204).json(updatedComment);
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

router.delete("/:commentId", async (request, response) => {
	try {
		const commentRepo = getRepository(Comment);
		await commentRepo.update(
			{ id: request.params.commentId },
			{ text: undefined, username: undefined }
		);
		response.status(204).end();
	} catch (error) {
		console.error(error); // debugging
		// TODO: which one to check
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
