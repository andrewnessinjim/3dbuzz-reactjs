import _ from "lodash";
import {shuffle} from "../shared/utils";

const PLACEHOLDER_REGEX= /\{\}/g;

function getWhiteCardCount(text: string): number {
	const match = text.match(PLACEHOLDER_REGEX);
	if(!match) {
		return 1;
	}

	return match.length;
}

interface RawCardSet {
	id: string
	name: string
	blackCards: Array<string>,
	whiteCards: Array<string>
}

interface CardSet {
	id: string
	name: string
	blackCards: Array<BlackCard>
	whiteCards: Array<WhiteCard>
}

interface BlackCard {
	id: string
	text: string
	set: string
	whiteCardCount: number
}

interface WhiteCard {
	id: string
	text: string
	set: string
}

export class CardDatabase {
	_sets: {[setName:string]:CardSet}
	get sets() {
		return _.map(this._sets, (set:RawCardSet) => ({id: set.id, name:set.name}));
	}

	constructor(){
		this._sets = {};
	}

	addSets(sets) {
		_.forOwn(sets, (set, setName) => this.addSet(setName, set));
	}

	addSet(setName:string, rawSet:RawCardSet) {
		this._sets[setName] = {
			id: setName,
			name: rawSet.name,
			blackCards: rawSet.blackCards.map((card:string, index:number) => ({
				id: `b-${setName}-${index}`,
				text: card.replace(PLACEHOLDER_REGEX, "_______"),
				set: setName,
				whiteCardCount: getWhiteCardCount(card)
			})),
			whiteCards: rawSet.whiteCards.map((card:string, index:number) => ({
				id: `w-${setName}-${index}`,
				text: card,
				set: setName,
			}))
		}
	}

	generateDecks(setIds = null) {
		const sets = setIds ? setIds.map(s => this._sets[s]) : _.values(this._sets);

		if(!sets.length)
			throw new Error("Cannot generate deck without any sets selected");

		const whiteCards =_.flatMap(sets, s => s.whiteCards);
		shuffle(whiteCards);

		const blackCards = _.flatMap(sets, s => s.blackCards);
		shuffle(blackCards);

		return new Deck(whiteCards, blackCards);
	}
}

export class Deck{
	_whiteDeck: WhiteCard[]
	_blackDeck: BlackCard[]
	_whiteDiscard: WhiteCard[]
	_blackIndex: number

	constructor(whiteCards, blackCards) {
		this._whiteDeck = whiteCards;
		this._blackDeck = blackCards;
		this._whiteDiscard = [];
		this._blackIndex = 0;
	}

	drawWhiteCards(count: number) {
		if (count >= this._whiteDeck.length) {
			if(count >= this._whiteDeck.length + this._whiteDiscard.length)
				throw new Error(`Cannot draw ${count} cards, since there aren't enough left!`);

			//Recycle discarded cards and shuffle them
			this._whiteDeck.push(...this._whiteDiscard);
			this._whiteDiscard = [];
			shuffle(this._whiteDeck);
		}

		return this._whiteDeck.splice(0, count);
	}

	drawBlackCard() {
		if(this._blackIndex >= this._blackDeck.length) {
			shuffle(this._blackDeck);
			this._blackIndex = 0;
		}

		return this._blackDeck[this._blackIndex++];
	}

	discardWhiteCards(cards) {
		this._whiteDiscard.push(...cards);
	}
}