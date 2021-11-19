import { Observable, BehaviorSubject } from "rxjs";
import _ from "lodash";

import * as A from "../actions";
import { mapOp$ } from "../../server/shared/observable";
import { Op } from "../../server/shared/observable";
import { createView$ } from "../lib/stores";

//State shared by all players
const defaultView = {
	id: null,
	title: null,
	step: A.STEP_DISPOSED,
	options: {},
	players: [],
	messages: [],
	round: null,
	timer: null
};

//State private to each individual player (the player's hand)
const defaultPlayerView = {
	id: null,
	hand: [],
	stack: null
}

export default class GameStore {
	opCreateGame$: Observable<Op>
	opJoinGame$: Observable<Op>
	opSetOptions$: Observable<Op>
	opStart$: Observable<Op>
	opSelectCard$: Observable<Op>
	opSelectStack$: Observable<Op>
	opSendMessage$: Observable<Op>
	view$: Observable<{step:string, players: Array<object>}>
	player$: Observable<{id: number}>

	constructor({dispatcher, socket}, user)	 {
		const passThroughAction = action => socket.emit("action", action);
		dispatcher.onRequest({
			[A.GAME_CREATE]: passThroughAction,
			[A.GAME_JOIN]: passThroughAction,
			[A.GAME_SET_OPTIONS]: passThroughAction,
			[A.GAME_START]: passThroughAction,
			[A.GAME_SELECT_CARD]: passThroughAction,
			[A.GAME_SELECT_STACK]: passThroughAction,
			[A.GAME_SEND_MESSAGE]: passThroughAction,
		});

		this.view$ = createView$(dispatcher, A.VIEW_GAME, defaultView)
		this.player$ = createView$(dispatcher, A.VIEW_PLAYER, defaultPlayerView);

		const isLoggedIn$ = user.details$.map(d => d.isLoggedIn);

		this.opCreateGame$ = mapOp$(
			dispatcher.on$(A.GAME_CREATE),
			isLoggedIn$);
		

		this.opJoinGame$ = mapOp$(
			dispatcher.on$(A.GAME_JOIN)
		);

		this.opSetOptions$ = mapOp$(
			dispatcher.on$(A.GAME_SET_OPTIONS),
			isLoggedIn$);
		
		this.opStart$ = mapOp$(
			dispatcher.on$(A.GAME_START),
			isLoggedIn$
		)

		const playerAndGame$ = Observable.combineLatest(this.view$, this.player$);

		this.opSelectCard$ = mapOp$(
			dispatcher.on$(A.GAME_SELECT_CARD),
			playerAndGame$.map(([game, player]) =>{
				const ourPlayer = _.find(game.players, {id: player.id});
				return ourPlayer && game.step == A.STEP_CHOOSE_WHITES && ourPlayer.isPlaying
			}));

		this.opSelectStack$ = mapOp$(
			dispatcher.on$(A.GAME_SELECT_STACK),
			playerAndGame$.map(([game, player]) =>{
				const ourPlayer = _.find(game.players, {id: player.id});
				return ourPlayer && game.step == A.STEP_JUDGE_STACKS && ourPlayer.isCzar
			}));

		this.opSendMessage$ = mapOp$(
			dispatcher.on$(A.GAME_SEND_MESSAGE),
			isLoggedIn$
		);
	}
}