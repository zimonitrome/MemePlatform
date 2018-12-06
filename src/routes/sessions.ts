import express from "express";
import { User } from "../repository/entities";
import { getRepository } from "typeorm";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

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
			response.status(400).json({ error: "unsupported_grant_type" }); // TODO: throw
			return;
		}

		const userRepo = getRepository(User);
		const user = await userRepo.findOneOrFail({ username });

		if (await compare(password, user.passwordHash)) {
			const accessToken = sign({}, process.env.TOKEN_SECRET!);
		}
	} catch (error) {}
});
