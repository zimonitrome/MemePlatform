import { Response } from "express";

interface JsonError {
	error: string;
}

export class CustomError {
	constructor(message: string, statusCode?: number) {
		this.message = message;
		this.statusCode = statusCode;
	}

	message: string;

	statusCode?: number;

	get jsonError(): JsonError {
		return { error: this.message };
	}
}

// tslint:disable-next-line:no-any
export const customErrorResponse = (response: Response, error: any) => {
	if (error instanceof CustomError) {
		response.status(error.statusCode || 400).json(error.jsonError);
	} else {
		response.status(500).end();
	}
};

// Function to convert errors given by databse to useful custom errors
// Currently used to give correct 404 responses where called
// tslint:disable-next-line:no-any
export const dbErrorToCustomError = (error: any) => {
	if (error.name === "EntityNotFound") {
		throw new CustomError("Not found.", 404);
	} else {
		throw error;
	}
};
