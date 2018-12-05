interface JsonError {
	errorMessage: string;
}

export class ValidationError {
	constructor(message: string) {
		this.message = message;
	}

	message: string;

	get jsonError(): JsonError {
		return { errorMessage: this.message };
	}
}
