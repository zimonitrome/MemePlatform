import { verify } from "jsonwebtoken";
import { ValidationError } from "./ValidationError";

interface AccessToken {
	sub: string;
	iat: number;
	exp: number;
}

export const authenticateHeader = (
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

export const authenticate = (header: string | undefined, username: string) => {
	const accessToken = authenticateHeader(header);
	if (!accessToken) {
		throw new ValidationError("Invalid token.");
	}
	if (accessToken.sub !== username) {
		throw new ValidationError("Unauthorized request.");
	}
};
