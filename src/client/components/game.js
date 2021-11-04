import "./game.scss";

import React, {Component} from "react";

class GameContainer extends Component {
	render() {
		return <p>GAME!</p>;
	}
}

class GameSidebar extends Component {
	render() {
		return <p>GAME SIDEBAR</p>;
	}
}

export default {
	Main: GameContainer,
	Sidebar: GameSidebar
};