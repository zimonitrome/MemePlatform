import express from "express";
import { getRepository, Repository, Like, IsNull } from "typeorm";
import { MemeTemplate, Meme } from "../repository/entities";
import whereQueryBuilder from "../helpers/whereQueryBuilder";
import {
	CustomError,
	customErrorResponse,
	dbErrorToCustomError
} from "../helpers/CustomError";
import { authorize } from "../helpers/authorizationHelpers";
import multer from "multer";
import {
	uploadImage,
	deleteImage,
	pathFromUrl
} from "../helpers/storageHelper";
import { v4 } from "uuid";
import { resizeImage } from "../helpers/memeGenerator";
import { defaultTakeAmount } from "../helpers/constants";

const router = express.Router();

const multerObj = multer().single("image");

Error.stackTraceLimit = Infinity;

router.post("/", multerObj, async (request, response) => {
	try {
		authorize(request.headers.authorization, request.body.username);

		if (!request.file) {
			throw new CustomError("No file supplied.");
		}

		if (!request.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
			throw new CustomError(
				"Unsupported image format. Should be png, jpg or gif."
			);
		}

		const imageInfo = await uploadImage(
			await resizeImage(request.file.buffer, 900),
			`templates/${v4()}`,
			request.file.mimetype
		);

		const memeTemplate = new MemeTemplate(
			request.body.username,
			imageInfo.Location,
			request.body.name
		);
		await memeTemplate.validate();
		const memeTemplateRepo = getRepository(MemeTemplate);
		const savedTemplate = await memeTemplateRepo.save(memeTemplate);

		console.log(savedTemplate);

		response.status(200).json(savedTemplate);
	} catch (error) {
		customErrorResponse(response, error);
	}
});

router.get("/", async (request, response) => {
	try {
		const memeTemplateRepo = getRepository(MemeTemplate);
		const queries = ["name", "username"];
		const isSearch = ["name"];
		const whereQueries = whereQueryBuilder(request.query, queries, isSearch);
		const pageSize = request.query.pageSize || defaultTakeAmount;
		const memeTemplates = await memeTemplateRepo.find({
			where: whereQueries,
			take: pageSize,
			skip: request.query.page * pageSize || 0
		});
		response.status(200).json(memeTemplates);
	} catch (error) {
		customErrorResponse(response, error);
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
		customErrorResponse(response, error);
	}
});

router.delete("/:templateId", async (request, response) => {
	try {
		const memeTemplateRepo = getRepository(MemeTemplate);
		const memeTemplate = await memeTemplateRepo
			.findOneOrFail({
				id: request.params.templateId
			})
			.catch(dbErrorToCustomError);
		authorize(request.headers.authorization, memeTemplate.username);

		const a = await deleteImage(pathFromUrl(memeTemplate.imageSource)).catch(
			_e => {
				throw new Error();
			}
		);

		await memeTemplateRepo.delete({ id: request.params.templateId });

		// "Blanks" templateId in all memes made from template
		const memeRepo = getRepository(Meme);
		const memes = await memeRepo.find({
			templateId: request.params.templateId
		});
		memes.forEach(async meme => {
			memeRepo.update({ id: meme.id }, { templateId: undefined });
		});

		response.status(204).end();
	} catch (error) {
		customErrorResponse(response, error);
	}
});

export default router;
