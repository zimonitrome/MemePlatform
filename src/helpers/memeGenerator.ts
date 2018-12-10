import * as Canvas from "canvas";
import { CanvasTextWrapper } from "canvas-text-wrapper";

interface ImageInfo {
	width: number;
	height: number;
	type: string;
}

const createMeme = (
	templateId: number,
	topText: string,
	bottomText: string
): string => {
	// Get template image
	// generateMemeImage
	// Upload memeIMage
	// Return URL
	return "";
};

const generateMemeImage = async (
	imageBuffer: Buffer,
	topText?: string,
	bottomText?: string
	// tslint:disable-next-line:no-any
): Promise<any> => {
	const imagePath = "5.jpg";

	const imageSize = sizeOf(imagePath);

	const canvas = Canvas.createCanvas(imageSize.width, imageSize.height);
	const ctx = canvas.getContext("2d");

	return new Promise(async (resolve, reject) => {
		const image = await Canvas.loadImage(imagePath);
		ctx.drawImage(image, 0, 0);

		drawText(canvas, imageSize, topText || "", "top");
		drawText(canvas, imageSize, bottomText || "", "bottom");
		const buffer = canvas.toBuffer();
		resolve(buffer);
	});
};

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
