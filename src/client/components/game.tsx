import "./game.scss";

import React from "react";
import { ContainerBase } from "../lib/component";

class GameContainer extends ContainerBase {
	render() {
		return <p>GAME!</p>;
	}
}

class GameSidebar extends ContainerBase {
	render() {
		return <p>GAME SIDEBAR</p>;
	}
}

export default {
	Main: GameContainer,
	Sidebar: GameSidebar
};