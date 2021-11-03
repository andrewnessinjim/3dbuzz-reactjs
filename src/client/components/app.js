import "./app.scss";

import React, {Component} from "react";

class AppContainer extends Component {
	componentDidMount() {
		console.log("App mounted");
	}
	render(){
		return <h1>Hello World!!</h1>;
	}
}

export default AppContainer;
