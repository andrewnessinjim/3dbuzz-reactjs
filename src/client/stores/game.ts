import * as A from "../actions";
import { mapOp$ } from "../../server/shared/observable";
import { Op } from "../../server/shared/observable";

import { Observable } from "rxjs";

export default class GameStore {
	opCreateGame$: Observable<Op>
	opJoinGame$: Observable<Op>

	constructor({dispatcher}, user)	 {
		const isLoggedIn$ = user.details$.map(d => d.isLoggedIn);

		dispatcher.onRequest({
			[A.GAME_CREATE]: action => {
				//Sequence of events we receive from the server when we create a game
				dispatcher.succeed(action);
				dispatcher.succeed(A.gameJoin(42));
			},
			[A.GAME_JOIN]: action => dispatcher.succeed(action)
		});

		this.opCreateGame$ = mapOp$(
			dispatcher.on$(A.GAME_CREATE),
			isLoggedIn$);
		

		this.opJoinGame$ = mapOp$(
			dispatcher.on$(A.GAME_JOIN)
		);


		//Logging only
		this.opCreateGame$.subscribe(opCreateGame => console.log(`opCreateGame$ log listener: ${JSON.stringify(opCreateGame)}`));
		this.opJoinGame$.subscribe(opJoinGame => console.log(`opJoinGame$ log listener: ${JSON.stringify(opJoinGame)}`));

	}
}