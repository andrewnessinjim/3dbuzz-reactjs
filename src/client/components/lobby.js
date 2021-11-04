import "./lobby.scss";
import React, {Component} from "react";
import PropTypes from "prop-types";

class LobbyContainer extends Component {
	constructor(props) {
		super(props);

		this._joinGame = (game) => {
			console.log(`TODO: Join Game ${game.title}`);
		};
	}

	render() {
		const games = [
			{title: "Game 1", id: 1, players: ["one", "two", "three"]},
			{title: "Game 2", id: 2, players: ["one", "two", "three"]},
			{title: "Game 3", id: 3, players: ["one", "two", "three"]},
			{title: "Game 4", id: 4, players: ["one", "two", "three"]},
			{title: "Game 5", id: 5, players: ["one", "two", "three"]},
		];
		return (
			<div className="c-lobby">
				<GameList games={games} joinGame={this._joinGame}/>
			</div>
		);
	}
}

class LobbySidebar extends Component {
	constructor(props) {
		super(props);

		this._login = () => {
			console.log("TODO: Implement LOGIN");
		};

		this._createGame = () => {
			console.log("TODO: CREATE GAME");
		};
	}

	render() {
		const canLogin = true;
		const canCreateGame = true;
		const createGameInProgress = false;

		return (
			<section className="c-lobby-sidebar">
				<div className="m-sidebar-buttons">
					{!canLogin ? null:
						<button className="m-button primary" onClick={this._login}>Login</button>}
					
					{!canCreateGame ? null :
						<button
							onClick={this._createGame}
							disabled={createGameInProgress}
							className="m-button good">
								Create Game
						</button>}
				</div>
			</section>
		);
	}
}

function GameList({games, joinGame}) {
	return (
		<section className="c-game-list">
			{games.length > 0 ? null :
				<div className="no-games">There are no games yet :(</div>}

			{games.map(game => 
				<div className="game" key={game.id} onClick={() => joinGame(game)}>
					<div className="title">{game.title}</div>
					<div className="players">
						{game.players.join(", ")}
					</div>
					<div className="join-game">Join Game</div>
				</div>
			)}
		</section>
	);
}

GameList.propTypes = {
	games: PropTypes.array,
	joinGame: PropTypes.func
};

export default {
	Main: LobbyContainer,
	Sidebar: LobbySidebar
};