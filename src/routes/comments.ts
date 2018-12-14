import express from "express";
import { getRepository, Repository, Like } from "typeorm";
import { Comment, Meme } from "../repository/entities";
import whereQueryBuilder from "../helpers/whereQueryBuilder";
import {
	CustomError,
	customErrorResponse,
	dbErrorToCustomError
} from "../helpers/CustomError";
import { authorize } from "../helpers/authorizationHelpers";
import { defaultTakeAmount } from "../helpers/constants";

const router = express.Router();

router.post("/", async (request, response) => {
	try {
		authorize(request.headers.authorization, request.body.username);

		const comment = new Comment(
			request.body.memeId,
			request.body.username,
			request.body.text,
			request.body.parentCommentId
		);

		await comment.validate();
		const commentRepo = getRepository(Comment);
		const savedComment = await commentRepo.save(comment);
		response.status(200).json(savedComment);
	} catch (error) {
		customErrorResponse(response, error);
	}
});

router.get("/:memeId", async (request, response) => {
	try {
		const commentRepo = getRepository(Comment);
		const pageSize = request.query.pageSize || defaultTakeAmount;

		await Comment.validateMemeId(request.params.memeId);

		const comments = await commentRepo.find({
			where: { memeId: request.params.memeId },
			take: pageSize,
			skip: request.query.page * pageSize || 0
		});
		response.status(200).json(comments);
	} catch (error) {
		customErrorResponse(response, error);
	}
});

router.patch("/:commentId", async (request, response) => {
	try {
		const commentRepo = getRepository(Comment);
		const comment = await commentRepo
			.findOneOrFail({
				id: request.params.commentId
			})
			.catch(dbErrorToCustomError);
		authorize(request.headers.authorization, comment.username);

		Comment.validateText(request.body.text);
		await commentRepo.update(
			{ id: request.params.commentId },
			{ text: request.body.text }
		);
		const updatedComment = await commentRepo.findOneOrFail({
			id: request.params.commentId
		});

		response.status(200).json(updatedComment);
	} catch (error) {
		customErrorResponse(response, error);
	}
});

router.delete("/:commentId", async (request, response) => {
	try {
		const commentRepo = getRepository(Comment);
		const comment = await commentRepo
			.findOneOrFail({
				id: request.params.commentId
			})
			.catch(dbErrorToCustomError);

		authorize(request.headers.authorization, comment.username);
		await commentRepo.update(
			{ id: request.params.commentId },
			{ text: undefined, username: undefined }
		);
		response.status(204).end();
	} catch (error) {
		customErrorResponse(response, error);
	}
});

export default router;
