import * as A from "../actions";
import { mapOp$ } from "shared/observable";


export default class GameStore {
	constructor({dispatcher}, user)	 {
		const isLoggedIn$ = user.details$.map(d => d.isLoggedIn);

		this.opCreateGame$ = mapOp$(
			dispatcher.on$(A.GAME_CREATE),
			isLoggedIn$);

		this.opJoinGame$ = mapOp$(
			dispatcher.on$(A.GAME_JOIN)
		)
	}
}