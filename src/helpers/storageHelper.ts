import { Credentials, S3, AWSError } from "aws-sdk";
import * as url from "url";
import imagemin from "imagemin";
// tslint:disable-next-line:no-var-requires
const imageminPngquant = require("imagemin-pngquant");
// tslint:disable-next-line:no-var-requires
const imageminJpegtran = require("imagemin-jpegtran");

const theCredentials = new Credentials(
	process.env.S3_ACCESS_KEY_ID as string,
	process.env.S3_SECRET_ACCESS_KEY as string
);

const s3 = new S3({
	credentials: theCredentials,
	region: process.env.S3_REGION as string
});

export const pathFromUrl = (urlString: string) =>
	url.parse(urlString).pathname!.substr(1);

export const uploadImage = async (
	file: Buffer,
	filePath: string,
	contentType: string
) => {
	const newFile = await imagemin.buffer(file, {
		plugins: [
			imageminJpegtran(),
			imageminPngquant({
				quality: [0.6, 0.8]
			})
		]
	});

	return await s3
		.upload({
			Bucket: process.env.S3_BUCKET!,
			Key: filePath,
			Body: newFile,
			ContentType: contentType
		})
		.promise();
};

export const deleteImage = (filePath: string) => {
	return s3
		.deleteObject({
			Bucket: process.env.S3_BUCKET!,
			Key: filePath
		})
		.promise();
};
