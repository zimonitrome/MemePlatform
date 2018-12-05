import { getRepository, getConnection } from "typeorm";
import * as entities from "./entities/index";
import { ValidationError } from "../helpers/ValidationError";

export default async () => {
	getConnection();
	console.log("inserting mockdata");
	const mockTemplates = [
		new entities.MemeTemplate(
			"zimonitrome",
			"https://i.kym-cdn.com/entries/icons/mobile/000/026/913/excuse.jpg",
			"excuse me wtf"
		)
	];
	const mockMemes = [
		new entities.Meme(
			1,
			"zimonitrome",
			"https://i.kym-cdn.com/photos/images/newsfeed/001/401/090/3e6.jpg",
			"hej"
		),
		new entities.Meme(
			1,
			"Voldemorph",
			"https://i.kym-cdn.com/photos/images/newsfeed/001/401/090/3e6.jpg"
		)
	];
	const mockUsers = [
		new entities.User("zimonitrome", "hunter22"),
		new entities.User("Voldemorph", "iasd3lenin")
	];
	const mockComments = [
		new entities.Comment(1, "Voldemorph", "This meme was gay"),
		new entities.Comment(1, "zimonitrome", "u mom gay", 1)
	];
	const mockVotes = [
		new entities.Vote(1, 1, "zimonitrome"),
		new entities.Vote(1, 1, "Voldemorph"),
		new entities.Vote(-1, 2, "zimonitrome")
	];
	try {
		mockTemplates.forEach(template => {
			template.validate();
		});

		mockMemes.forEach(meme => {
			meme.validate();
		});

		mockUsers.forEach(user => {
			user.validate();
		});

		mockComments.forEach(comment => {
			comment.validate();
		});

		mockVotes.forEach(vote => {
			vote.validate();
		});
	} catch (error) {
		console.error(error);
	}

	try {
		const memeRepo = await getRepository(entities.Meme);
		await memeRepo.insert(mockMemes);
		const templateRepo = await getRepository(entities.MemeTemplate);
		await templateRepo.insert(mockTemplates);
		const userRepo = await getRepository(entities.User);
		await userRepo.insert(mockUsers);
		const commentRepo = await getRepository(entities.Comment);
		await commentRepo.insert(mockComments);
		const voteRepo = await getRepository(entities.Vote);
		await voteRepo.insert(mockVotes);
	} catch (error) {
		console.error(error);
	}
};
