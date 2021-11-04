import "./app.scss";

import React from "react";
import { ContainerBase } from "../lib/component";
import PropTypes from 'prop-types';
//import dialogTypes from "./dialogs";

class AppContainer extends ContainerBase {
	static propTypes = {
		Main: PropTypes.func.isRequired,
		Sidebar: PropTypes.func.isRequired
	}

	componentDidMount() {
		const {stores: {app}} = this.context;
		this.subscribe(app.dialog$, dialogs => this.setState({dialogs}));
	}

	render(){
		const {Main, Sidebar} = this.props;
		console.log(this.state && this.state.dialogs);

		return (
			<div className={`c-application`}>
				<div className="inner">
					<div className="sidebar">
						<Sidebar/>
					</div>
					<div className="main">
						<Main />
					</div>
				</div>
			</div>
		);
	}
}

export default AppContainer;
