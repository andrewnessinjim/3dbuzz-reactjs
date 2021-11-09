import * as A from "../actions";

import { Observable } from "rxjs"
import { Validator } from "../../server/shared/validation";
import { validateMessage } from "../../server/shared/validation/chat";
import { mapOp$, Op } from "../../server/shared/observable";

const defaultView = {
	messages: [
		{index: 1, name: "Person", message: "Blegh"},
		{index: 2, name: "Nelson", message: "Blegh   erfw e"},
		{index: 3, name: "Sarah", message: "Blegh erwer "},
		{index: 4, name: "Andrew", message: "Blegh fdw fawqer"},
		{index: 5, name: "Nelson 2", message: "Blegh adefqa"},
		{index: 6, name: "Nelson 3", message: "Blegh adfad"},
	],
	games: [
		{title: "Game 1", id: 1, players: ["one", "two", "three"]},
		{title: "Game 2", id: 2, players: ["one", "two", "three"]},
		{title: "Game 3", id: 3, players: ["one", "two", "three"]},
		{title: "Game 4", id: 4, players: ["one", "two", "three"]},
		{title: "Game 5", id: 5, players: ["one", "two", "three"]},
	]
}

export default class LobbyStore {
	view$: Observable<object>
	opSendMessage$: Observable<Op>

	constructor({dispatcher}, user)	 {
		this.view$ = Observable.of(defaultView);

		dispatcher.onRequest({
			[A.LOBBY_JOIN]: action => dispatcher.succeed(action),

			[A.LOBBY_SEND_MESSAGE]: action => {
				const validator =  new Validator();
				if(!user.isLoggedIn) {
					validator.push("You must be logged in");
				}

				validator.push(validateMessage(action.message));

				if(validator.didFail){
					dispatcher.fail(action, validator.message);
					return
				}

				// TODO: SEND TO SOCKET
			}
		});

		this.opSendMessage$ = mapOp$(
			dispatcher.on$(A.LOBBY_SEND_MESSAGE),
			user.details$.map(u => u.isLoggedIn)
		);

		this.opSendMessage$.subscribe(opSendMessage => console.log(`opSendMessage$ log listener: ${JSON.stringify(opSendMessage)}`));
	}
}