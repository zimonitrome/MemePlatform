import express from "express";
import { User } from "../repository/entities";
import { getRepository } from "typeorm";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { ValidationError } from "../helpers/ValidationError";

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
			response.status(400).json({ error: "unsupported_grant_type" });
			return;
		}

		const userRepo = getRepository(User);
		const user = await userRepo.findOne({ username });

		if (user && (await compare(password, user.passwordHash))) {
			const accessToken = sign({ sub: username }, process.env.TOKEN_SECRET!, {
				expiresIn: 21600
			});
			response.status(200).json({ accessToken });
		} else {
			response.status(400).json({ error: "invalid_grant" });
			return;
		}
	} catch (error) {
		console.error(error); // debugging
		if (error instanceof ValidationError) {
			response.status(400).json({ error: "invalid_request" });
		} else {
			response.status(500).end();
		}
	}
});
