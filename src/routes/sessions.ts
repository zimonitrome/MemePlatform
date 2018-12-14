import express from "express";
import { User } from "../repository/entities";
import { getRepository } from "typeorm";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { CustomError, customErrorResponse } from "../helpers/CustomError";

const router = express.Router();

export default router;

router.post("/", async (request, response) => {
	try {
		const grant_type = request.body.grant_type;
		const username = request.body.username;
		const password = request.body.password;

		User.validateUsername(username);
		User.validatePassword(password);

		if (grant_type !== "password") {
			throw new CustomError("unsupported_grant_type");
		}

		const userRepo = getRepository(User);
		const user = await userRepo.findOne({ username });

		if (user && (await compare(password, user.passwordHash))) {
			const accessToken = sign({ sub: username }, process.env.TOKEN_SECRET!, {
				expiresIn: 21600
			});
			response.status(200).json({ accessToken });
		} else {
			throw new CustomError("invalid_grant");
		}
	} catch (error) {
		customErrorResponse(response, error);
	}
});
