import * as A from "../actions";
import { mapOp$ } from "../../server/shared/observable";
import { Op } from "../../server/shared/observable";

import { Observable } from "rxjs";

export default class GameStore {
	opCreateGame$: Observable<Op>
	opJoinGame$: Observable<Op>

	constructor({dispatcher}, user)	 {
		const isLoggedIn$ = user.details$.map(d => d.isLoggedIn);

		this.opCreateGame$ = mapOp$(
			dispatcher.on$(A.GAME_CREATE),
			isLoggedIn$);
		this.opCreateGame$.subscribe(opCreateGame => console.log(`opCreateGame$ log listener: ${JSON.stringify(opCreateGame)}`));

		this.opJoinGame$ = mapOp$(
			dispatcher.on$(A.GAME_JOIN)
		);
		this.opJoinGame$.subscribe(opJoinGame => console.log(`opJoinGame$ log listener: ${JSON.stringify(opJoinGame)}`));

	}
}