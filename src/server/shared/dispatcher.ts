/* eslint-disable no-prototype-builtins */
import _ from "lodash";
import { Observable } from "rxjs";
import * as A from "./actions";

export interface Action {
	type: string,
	status?: string,
	details?: {
		isLoggedIn?: boolean, id?: number, name?: string
	}
}

export class Dispatcher {
	_handlers
	_emitBuffer
	_inEmit: boolean

	constructor(){
		this._handlers = {};

		//To prevent re-dispatching actions if already in dispatch
		this._emitBuffer = [];
		this._inEmit = false;
	}

	on(typeOrCallbacks, callback = null, statusFilter = null) {
		if(_.isObject(typeOrCallbacks)) {
			const unreg = _.map(
				typeOrCallbacks,
				(callback, type) => this.on(type, callback, statusFilter)
			);

			return () => unreg.forEach(unsub => unsub());
		}

		if(!_.isFunction(callback))
			throw new Error("callback must be of type function");

		const type = typeOrCallbacks;
		const handler = {statusFilter, callback};

		if (!this._handlers.hasOwnProperty(type))
			this._handlers[type] = [handler];
		else
			this._handlers[type].push(handler);

		return () => {
			const handlers = this._handlers[type];
			const index = handlers.indexOf(handler);

			if(index == -1)
				return;

			handlers.splice(index, 1);
		};
	}

	onRequest(typeOrCallbacks, callback = null) {
		return this.on(typeOrCallbacks, callback, A.STATUS_REQUEST);
	}

	onFail(typeOrCallbacks, callback = null) {
		return this.on(typeOrCallbacks, callback, A.STATUS_FAIL);
	}

	onSuccess(typeOrCallbacks, callback = null) {
		return this.on(typeOrCallbacks, callback, A.STATUS_REQUEST);
	}

	on$(type: string): Observable<Action> {
		return new Observable(subscriber => {
			return this.on(type, value => subscriber.next(value));
		});
	}

	onRequest$(type: string): Observable<Action> {
		return this.on$(type).filter(action => action.status == A.STATUS_REQUEST);
	}

	onFail$(type: string): Observable<Action> {
		return this.on$(type).filter(action => action.status == A.STATUS_FAIL);
	}

	onSuccess$(type: string): Observable<Action> {
		return this.on$(type).filter(action => action.status == A.STATUS_SUCCESS);
	}

	emit(action: Action) {
		if(this._inEmit) {
			this._emitBuffer.push(action);
			return;
		}

		this._emitBuffer = [];
		this._inEmit = true;

		if(this._handlers.hasOwnProperty("*")) {
			this._handlers["*"].forEach(h => invokeHandler(action, h));
		}


		if(this._handlers.hasOwnProperty(action.type)) {
			this._handlers[action.type].forEach(h => invokeHandler(action, h));
		}

		const buffer = this._emitBuffer;
		this._emitBuffer = [];
		this._inEmit = false;

		for(let subAction of buffer) {
			this.emit(subAction);
		}
	}

	request(action: Action) {
		this.emit(A.request(action));
	}

	fail(action: Action, error?) {
		this.emit(A.fail(action, error));
	}

	succeed(action: Action) {
		this.emit(A.succeed(action));
	}

	respond(action: Action, validator) {
		if(validator.didFail)
			this.fail(action, validator.message);
		else
			this.succeed(action);
	}
}

function invokeHandler(action, {statusFilter, callback}) {
	if(statusFilter && statusFilter != action.status)
		return;

	callback(action);
}