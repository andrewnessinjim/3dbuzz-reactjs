import * as A from "../actions";
import { Dispatcher } from "../shared/dispatcher";
import { RoomBase } from "../lib/room";
import { CardDatabase } from "./cards";

export class Application extends RoomBase {
	dispatcher:Dispatcher
	cards: CardDatabase

	get view() {
		return {
			sets: this.cards.sets
		};
	}

	constructor(cards: CardDatabase) {
		super(A.VIEW_APP);
		this.dispatcher = new Dispatcher();
		this.cards = cards;
		//TODO : MAKE LOBBY
	}
}