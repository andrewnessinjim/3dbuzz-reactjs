import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import AppContainer from "./components/app";
import Lobby from "./components/lobby";
import Game from "./components/game";

export default function renderRoutes() {
	return (
		<Switch>
			<Route path="/game/:gameId">
				<AppContainer {...Game}/>
			</Route>
			<Route path="/">
				<AppContainer {...Lobby}/>
			</Route>
			<Redirect from="*" to="/"/>
		</Switch>
	);
}