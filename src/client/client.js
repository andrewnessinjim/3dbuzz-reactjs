import "./client.scss";

import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router} from "react-router-dom";

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