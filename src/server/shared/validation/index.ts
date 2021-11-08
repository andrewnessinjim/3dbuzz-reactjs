export class Validator {
	_errors: Array<string>

	static fail(error) {
		const validator = new Validator();
		validator.push(error);
		return validator;
	}

	static succeed() {
		return new Validator();
	}

	get didFail() {
		return this._errors.length > 0;
	}

	get didSucceed() {
		return this._errors.length == 0;
	}

	get message() {
		return this._errors.join(" ");
	}

	constructor() {
		this._errors = [];
	}

	push(error:string|Validator) {
		if (error instanceof Validator) {
			for (let message of error._errors) {
				this._errors.push(message);
			}
		} else {
			this._errors.push(error);
		}
	}

	assert(condition, error) {
		if(condition) return;

		this.push(error);
	}
}