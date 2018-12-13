import { Credentials, S3, AWSError } from "aws-sdk";
import * as url from "url";

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

export const uploadImage = (
	file: Buffer,
	filePath: string,
	contentType: string
) =>
	s3
		.upload({
			Bucket: process.env.S3_BUCKET!,
			Key: filePath,
			Body: file,
			ContentType: contentType
		})
		.promise();

export const deleteImage = (filePath: string) => {
	return s3
		.deleteObject({
			Bucket: process.env.S3_BUCKET!,
			Key: filePath
		})
		.promise();
};
