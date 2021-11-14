import "./game.scss";

import React from "react";
import * as A from "../actions";
import { ContainerBase } from "../lib/component";

class GameContainer extends ContainerBase {
	componentWillMount() {
		const {stores: {app}} = this.context;
		const {params} = this.context.router.route.match;
		const gameId = parseInt(params.gameId);

		this.subscribe(app.reconnected$, () => this.request(A.gameJoin(gameId)));
		this.request(A.gameJoin(gameId));
	}
	render() {
		return <p>GAME!</p>;
	}
}

class GameSidebar extends ContainerBase {
	state
	_exitGame
	_login

	constructor(props) {
		super(props);

		this._exitGame = () => this.context.router.history.push("/");
		this._login = () => this.dispatch(A.dialogSet(A.DIALOG_LOGIN, true));
	}

	componentWillMount() {
		const {stores: {user, game}} = this.context;
		this.subscribe(user.opLogin$, opLogin => this.setState({opLogin}));
		this.subscribe(game.view$, game => this.setState({game}));
	}

	render() {
		const {opLogin, game} = this.state;
		return(
			<section className="c-game-sidebar">
				<div className="m-sidebar-buttons">
					{!opLogin.can ? null :
						<button className="m-button primary" onClick={this._login}>
							Login to join game
						</button>}

					<button className="m-button" onClick={this._exitGame}>
						Leave game
					</button>
				</div>
				{game.step == A.STEP_DISPOSED ? null:
						<PlayerList players={game.players}/>}
			</section>
		)
	}
}

function PlayerList({players}) {
	return (
		<ul className="c-player-list">
			{players.map(player => {
				const [cls, status] = getPlayerStatus(player);
				return (
					<li key={player.id} className={cls}>
						<div className="details">
							<div className="name">{player.name}</div>
							<div className="score">
								{player.score}
								{player.score == 1 ? " point": " points"}
							</div>
						</div>
						<div className="status">{status}</div>
					</li>
				)
			})}
		</ul>
	);
}

function getPlayerStatus({isCzar, isWinner, isPlaying}): [cssClass:string, textIndicator:string] {
	if(isCzar) return ["is-czar", "czar"];
	if(isWinner) return ["is-winner", "winner!"];
	if(isPlaying) return ["is-playing", "playing"]
	return ["",""];
}

export default {
	Main: GameContainer,
	Sidebar: GameSidebar
};