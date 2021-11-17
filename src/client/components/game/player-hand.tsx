import "./player-hand.scss";

import React from "react";
import Card from "./card";

export default function PlayerHand(props) {
	const {hand, opSelectCard, selectCard, toggle, isOpen} = props;
	const caret = isOpen? "▼" : "▲";

	return (
		<div className={`c-player-hand ${isOpen? "is-open" : "is-closed"}`}>
			<div className={`title ${opSelectCard.can? "is-active": ""}`} onClick={toggle}>
				<i className={"fa"}>{caret}</i>
				{opSelectCard.error}
				<i className={"fa"}>{caret}</i>
			</div>
			<div className="cards">
			{hand.map(card => 
				<Card
					key={card.id}
					isSelectable={opSelectCard.can && !opSelectCard.inProgress}
					onClick={() => selectCard(card)}
					type="white"
					card={card}
					style="small"
					canZoom/>)}
			</div>
		</div>
	);
}