import AWS, { AWSError, S3 } from "aws-sdk";

const theCredentials = new AWS.Credentials(
	process.env.S3_ACCESS_KEY_ID as string,
	process.env.S3_SECRET_ACCESS_KEY as string
);

const s3 = new AWS.S3({
	credentials: theCredentials,
	region: process.env.S3_REGION as string
});

export const uploadImage = (
	file: Buffer,
	destFileName: string,
	contentType: string,
	callback?: (err: AWS.AWSError, _data: S3.ManagedUpload.SendData) => void
) => {
	console.log(destFileName);
	s3.upload({
		Bucket: process.env.S3_BUCKET!,
		Key: "namejaja",
		Body: file,
		ContentType: contentType
	}).send(callback);
};
