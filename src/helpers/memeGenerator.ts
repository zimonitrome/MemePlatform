// tslint:disable-next-line:no-var-requires
const Canvas = require("canvas");
import {
	CanvasTextWrapper,
	CanvasTextWrapperOptions
} from "canvas-text-wrapper";
import { getRepository } from "typeorm";
import { MemeTemplate } from "../repository/entities";
import fetch from "node-fetch";
import { v4 } from "uuid";
import { uploadImage } from "./storageHelper";
import { CustomError } from "./CustomError";

interface ImageInfo {
	width: number;
	height: number;
}

export const createMeme = async (
	templateId: number,
	topText: string,
	bottomText: string
): Promise<string> =>
	new Promise(async (resolve, reject) => {
		try {
			const memeTemplateRepo = getRepository(MemeTemplate);
			const memeTemplate = await memeTemplateRepo.findOneOrFail({
				where: { id: templateId }
			});
			const response = await fetch(memeTemplate.imageSource);

			const memeImage = await generateMemeImage(
				await response.buffer(),
				topText,
				bottomText
			);

			const imageInfo = await uploadImage(
				memeImage,
				`memes/${v4()}`,
				"image/jpg"
			);
			resolve(imageInfo.Location);
		} catch (error) {
			if (error.name === "EntityNotFound") {
				reject(new CustomError("templateId does not exist."));
			}
			reject(error);
		}
	}) as Promise<string>;

export const resizeImage = async (
	inputImage: Buffer,
	maxSize: number
): Promise<Buffer> =>
	new Promise(async (resolve, reject) => {
		try {
			// tslint:disable-next-line:no-any
			const image: any = await loadImageAsync(inputImage);

			const newWidth =
				image.width > image.height
					? maxSize
					: maxSize * (image.width / image.height);
			const newHeight =
				image.width > image.height
					? maxSize * (image.height / image.width)
					: maxSize;

			const canvas = Canvas.createCanvas(newWidth, newHeight);
			const ctx = canvas.getContext("2d");

			ctx.drawImage(image, 0, 0, newWidth, newHeight);

			resolve(canvas.toBuffer());
		} catch (error) {
			reject(error);
		}
	}) as Promise<Buffer>;

const generateMemeImage = async (
	imageBuffer: Buffer,
	topText?: string,
	bottomText?: string
	// tslint:disable-next-line:no-any
): Promise<Buffer> =>
	new Promise(async (resolve, reject) => {
		try {
			// tslint:disable-next-line:no-any
			const image: any = await loadImageAsync(imageBuffer);

			const imageSize = { width: image.width, height: image.height };

			const canvas = Canvas.createCanvas(imageSize.width, imageSize.height);
			const ctx = canvas.getContext("2d");

			ctx.drawImage(image, 0, 0);

			drawText(canvas, imageSize, topText || "", "top");
			drawText(canvas, imageSize, bottomText || "", "bottom");
			const buffer = canvas.toBuffer();

			resolve(buffer);
		} catch (error) {
			reject(error);
		}
	}) as Promise<Buffer>;

const drawText = (
	// tslint:disable-next-line:no-any
	canvas: any,
	imageSize: ImageInfo,
	text: string,
	position: "bottom" | "top"
) => {
	text = text.toLocaleUpperCase();
	const ratio = 0.23;
	const textCanvas = Canvas.createCanvas(
		imageSize.width,
		imageSize.height * ratio
	);

	const textCtx = textCanvas.getContext("2d");
	textCtx.fillStyle = "rgba(255,255,255,1)";
	textCtx.strokeStyle = "rgba(0,0,0,1)";
	textCtx.lineWidth =
		(Math.max(imageSize.width, imageSize.height) / 700) *
		(-1.5 * Math.log(text.length) + 45 * ratio);
	CanvasTextWrapper(textCanvas, text, {
		font: "100px Impact",
		strokeText: true,
		textAlign: "center",
		sizeToFill: true,
		paddingY: (textCtx.lineWidth + 4) / 2,
		paddingX: 5
	});
	CanvasTextWrapper(textCanvas, text, {
		font: "100px Impact",
		strokeText: false,
		textAlign: "center",
		sizeToFill: true,
		paddingY: (textCtx.lineWidth + 4) / 2,
		paddingX: 5
	});

	canvas
		.getContext("2d")
		.drawImage(
			textCanvas,
			0,
			position === "bottom" ? imageSize.height * (1 - ratio) : 10
		);
};

const loadImageAsync = (imageBuffer: Buffer) => {
	return new Promise((resolve, reject) => {
		const img = new Canvas.Image();

		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error("Failed to load image"));

		img.src = imageBuffer;
	});
};
