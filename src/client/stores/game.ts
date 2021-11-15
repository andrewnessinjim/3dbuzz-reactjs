import { Observable, BehaviorSubject } from "rxjs";
import _ from "lodash";

import * as A from "../actions";
import { mapOp$ } from "../../server/shared/observable";
import { Op } from "../../server/shared/observable";


//State shared by all players
const defaultView = {
	id: 42,
	title: "Nelson's Game",
	step: A.STEP_SETUP,
	options: {
		scoreLimit: 5,
		sets: ["1ed"]
	},
	players: [
		{id: 1, name: "Nelson", score: 3, isCzar: false, isPlaying:false, isWinner: true},
		{id: 2, name: "LaQuet", score: 1, isCzar: false, isPlaying:true, isWinner: false},
		{id: 3, name: "Andrew", score: 4, isCzar: true, isPlaying:false, isWinner: false},
		{id: 4, name: "Nessin", score: 2, isCzar: false, isPlaying:false, isWinner: false}
	],
	messages: [
		{index: 1, name: "Nelson", messages: "Blegh"},
		{index: 2, name: "Nelson", messages: "Blegh"},
		{index: 3, name: "Nelson", messages: "Blegh"},
		{index: 4, name: "Nelson", messages: "Blegh"}
	],
	round: null,
	timer: null
};

//State private to each individual player (the player's hand)
const defaultPlayerView = {
	id: 1,
	hand: [], //currently in hand
	stack: null //currently played
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

	constructor({dispatcher}, user)	 {
		dispatcher.onRequest({
			[A.GAME_CREATE]: action => {
				//Sequence of events we receive from the server when we create a game
				dispatcher.succeed(action);
				dispatcher.succeed(A.gameJoin(42));
			},
			[A.GAME_JOIN]: action => dispatcher.succeed(action),
			[A.GAME_SET_OPTIONS]: action => dispatcher.succeed(action),
			[A.GAME_START]: action => dispatcher.succeed(action),
			[A.GAME_SELECT_CARD]: action => dispatcher.succeed(action),
			[A.GAME_SELECT_STACK]: action => dispatcher.succeed(action),
			[A.GAME_SEND_MESSAGE]: action => dispatcher.succeed(action),
		});

		this.view$ = new BehaviorSubject(defaultView);
		this.player$ = new BehaviorSubject(defaultPlayerView);

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

		//Logging only
		this.opCreateGame$.subscribe(opCreateGame => console.log(`opCreateGame$ log listener: ${JSON.stringify(opCreateGame)}`));
		this.opJoinGame$.subscribe(opJoinGame => console.log(`opJoinGame$ log listener: ${JSON.stringify(opJoinGame)}`));

	}
}