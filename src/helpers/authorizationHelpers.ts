import { verify } from "jsonwebtoken";
import { CustomError } from "./CustomError";

interface AccessToken {
	sub: string;
	iat: number;
	exp: number;
}

export const verifyHeader = (
	header: string | undefined
): AccessToken | undefined => {
	try {
		const headerParts = header!.split(" ");
		if (headerParts[0] !== "Bearer") {
			throw new Error();
		}
		const accessToken = headerParts[1];
		return verify(accessToken, process.env.TOKEN_SECRET!) as AccessToken;
	} catch (err) {
		return undefined;
	}
};

export const authorize = (header: string | undefined, username: string) => {
	const accessToken = verifyHeader(header);
	if (!accessToken) {
		throw new CustomError("Invalid token.");
	}
	if (accessToken.sub !== username) {
		throw new CustomError("Unauthorized request.", 401);
	}
};
