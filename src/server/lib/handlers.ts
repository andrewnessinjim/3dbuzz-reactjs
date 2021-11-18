export class HandlerBase {
	client
	_onDisposes

	constructor(client) {
		this.client = client;
		this._onDisposes = [];
	}

	onLogin() {

	}

	dispose() {
		this._onDisposes.forEach(d => d());
		this._onDisposes = [];
	}

	onDispose(...callbacks) {
		this._onDisposes.push(...callbacks);
	}
}