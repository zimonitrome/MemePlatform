import { Credentials, S3, AWSError } from "aws-sdk";

const theCredentials = new Credentials(
	process.env.S3_ACCESS_KEY_ID as string,
	process.env.S3_SECRET_ACCESS_KEY as string
);

const s3 = new S3({
	credentials: theCredentials,
	region: process.env.S3_REGION as string
});

export const uploadImage = (
	file: Buffer,
	destFileName: string,
	contentType: string
) =>
	s3
		.upload({
			Bucket: process.env.S3_BUCKET!,
			Key: destFileName,
			Body: file,
			ContentType: contentType
		})
		.promise();
