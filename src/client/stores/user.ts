import { BehaviorSubject, ConnectableObservable, Observable} from "rxjs";
import { validateName } from "../../server/shared/validation/user";
import { mapOp$, Op } from "../../server/shared/observable";

import * as A from "../actions";
import { Dispatcher } from "../../server/shared/dispatcher";

const defaultDetails = {
	isLoggedIn: false,
	id: null,
	name: null
};

export default class UserStore {
	details$: ConnectableObservable<{isLoggedIn?: boolean, id?: number, name?: string}>
	opLogin$: Observable<Op>

	constructor({dispatcher, socket}:{dispatcher: Dispatcher, socket: any}) {
		this.details$ = dispatcher.on$(A.USER_DETAILS_SET)
		.map(a => a.details)
		.startWith(defaultDetails)
		.publishReplay(1);

		this.details$.connect();

		this.details$.subscribe(details =>
			Object.keys(details).forEach(k => this[k] = details[k]));

		dispatcher.onRequest({
			[A.USER_LOGIN]: (action) => {
				const validator = validateName(action.name);
				if(validator.didFail) {
					dispatcher.fail(action, validator.message);
					return;
				}

				socket.emit("action", action);
			}
		});

		this.opLogin$ = mapOp$(
			dispatcher.on$(A.USER_LOGIN),
			this.details$.map(details => !details.isLoggedIn)
		);
		this.opLogin$.subscribe(opLogin => console.log(`opLogin$ log listener: ${JSON.stringify(opLogin)}`));
	}
}