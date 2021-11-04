import "./client.scss";

import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router} from "react-router-dom";

import * as A from "./actions";
import {Dispatcher} from "shared/dispatcher";
import createStores from "./stores";

//------------------------------------
// Services
const dispatcher = new Dispatcher();
const services = {dispatcher};

//------------------------------------
// Stores
const stores = createStores(services);

//------------------------------------
// Render
function main() {
	const routes = require("./routes").default();
	ReactDOM.render(
		<Router>
			{routes}
		</Router>,
		document.getElementById("mount"));
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