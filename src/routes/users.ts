import express from "express";
import { getRepository, Repository, Like } from "typeorm";
import { User } from "../repository/entities";
import whereQueryBuilder from "../helpers/whereQueryBuilder";

const router = express.Router();

export default router;

router.post("/", async (request, response) => {
	// TODO: validate parameters

	try {
		// TODO: Validate password before hashing it
		var unhashedPassword = request.body.password;
		var hashedPassword = unhashedPassword;
		var salt = "5123sdfdsf";
		//TODO: Generate hash and stuff
		const user = new User(request.body.username, unhashedPassword, salt);
		const userRepo = getRepository(User);
		await userRepo.save(user);
		response.status(204).end(); //vad ska vi returnera?
	} catch (error) {
		console.error(error); // debugging
		if (error.code === "23502") {
			response.status(400).json({ errorMessage: "Missing parameter(s)." });
		} else if (error.code === "22P02") {
			response.status(400).json({ errorMessage: "Invalid parameter(s)." });
		} else {
			response.status(500).json("Internal server error.");
		}
	}
});

router.get("/", async (request, response) => {
	try {
		const userRepo = getRepository(User);
		const queries = ["name"];
		const isSearch = ["name"];
		const whereQueries = whereQueryBuilder(request.query, queries, isSearch);
		const users = await userRepo.find({ where: whereQueries });
		response.status(200).json(users);
	} catch (error) {
		console.error(error); // debugging
		response.status(500).json("Internal server error.");
	}
});

router.put("/:username", async (request, response) => {
	// TODO: validate parameters

	try {
		const userRepo = getRepository(User);
		var unhashedPassword = request.body.password;
		var hashedPassword = unhashedPassword;
		var salt = "5123sdfdsf";
		//TODO: Generate hash and stuff
		await userRepo.update(
			{ username: request.body.username },
			{ passwordHash: hashedPassword }
		);
		response.status(204).end(); //vad ska vi returnera?
	} catch (error) {
		console.error(error); // debugging
		if (error.name === "EntityNotFound") {
			response.status(404).end();
		} else if (error.code === "23502") {
			response.status(400).json({ errorMessage: "Missing parameter(s)." });
		} else if (error.code === "22P02") {
			response.status(400).json({ errorMessage: "Invalid parameter(s)." });
		} else {
			response.status(500).json("Internal server error.");
		}
	}
});

router.delete("/:username", async (request, response) => {
	try {
		const userRepo = getRepository(User);
		await userRepo.delete({ username: request.params.username });
		response.status(204).end();
	} catch (error) {
		console.error(error); // debugging
		if (error.name === "EntityNotFound") {
			response.status(404).end();
		} else if (error.code === "22P02") {
			response.status(400).json({ errorMessage: "Invalid parameter(s)." });
		} else {
			response.status(500).json("Internal server error.");
		}
	}
});

router.post("/login-sessions", async (request, response) => {
	// TODO: validate parameters

	try {
		//TODO: Do login stuff
		const userRepo = getRepository(User);
		response.status(204).end();
	} catch (error) {
		console.error(error); // debugging
		if (error.code === "23502") {
			response.status(400).json({ errorMessage: "Missing parameter(s)." });
		} else if (error.code === "22P02") {
			response.status(400).json({ errorMessage: "Invalid parameter(s)." });
		} else {
			response.status(500).json("Internal server error.");
		}
	}
});
