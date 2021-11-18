import "./client.scss";

import _ from "lodash";
import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import io from "socket.io-client";

import { StoreProvider } from "./lib/component";
import { Dispatcher } from "../server/shared/dispatcher";
import createStores, { Stores } from "./stores";
import * as A from "./actions";

//------------------------------------
// Services
const dispatcher = new Dispatcher();
const socket = io();
const services = {dispatcher, socket};

if(IS_DEVELOPMENT) {
	dispatcher.on("*", printAction);
}

socket.on("action", action => dispatcher.emit(action));

//------------------------------------
// Stores
const stores = createStores(services);

//------------------------------------
// Render
function main() {
	const routes = require("./routes").default();
	ReactDOM.render(
		<StoreProvider stores={stores} services={services}>
			<BrowserRouter>
				{routes}
			</BrowserRouter>
		</StoreProvider>,
		document.getElementById("mount"));
}

export interface AppContext {
	stores: Stores,
	services: {
		dispatcher: Dispatcher
	},
	router: any
}

//------------------------------------
// Misc
if (module.hot) {
	module.hot.accept("./routes", () => {
		main();
	});
}

//------------------------------------
// Go!
main();

//------------------------------------
// Helpers
function printAction(action) {
	// eslint-disable-next-line no-prototype-builtins
	if(action.hasOwnProperty("status")) {
		let style = null;
		switch(action.status) {
			case A.STATUS_REQUEST: style = "color: blue"; break;
			case A.STATUS_FAIL: style = "color: red"; break;
			case A.STATUS_SUCCESS: style = "color: green"; break;
		}

		console.log(`%c ${action.type}`, `${style}; font-weight: bold; background: #eee; width: 100%; display: block;`);
	} else {
		console.log(`%c${action.type}`, "background: #ddd");
	}

	const result = _.omit(action, ["type", "status"]);
	if(_.keys(result).length)
		console.log(result);
}