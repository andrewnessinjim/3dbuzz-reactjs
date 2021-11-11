import _ from "lodash";
import { Observable, BehaviorSubject } from "rxjs";
import * as A from "../actions";

export default class AppStore {
	dialog$
	connection$
	reconnected$

	constructor({dispatcher}) {
		this.dialog$ = dispatcher
			.on$(A.DIALOG_SET)
			.scan((stack, action) => {

				//If the dialog is already open, then remove it and bring it to the top of the stack
				_.remove(stack, {id:action.id});
				if(action.isOpen)
					stack.push({id: action.id, props: action.props});

				return stack; //Stack represents the list of open dialogs, starts as an empty array
			}, [])
			.startWith([])
			.publishReplay(1);

		this.dialog$.connect();

		this.connection$ = new BehaviorSubject(A.CONNECTION_CONNECTED);
		this.reconnected$ = Observable.empty();
	}
}