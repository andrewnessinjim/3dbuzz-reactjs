import "./app.scss";

import React from "react";
import * as A from "../actions";
import { ContainerBase } from "../lib/component";
import PropTypes from 'prop-types';
import dialogTypes from "./dialogs";

class AppContainer extends ContainerBase {
	props: {Main, Sidebar}
	state

	static propTypes = {
		Main: PropTypes.func.isRequired,
		Sidebar: PropTypes.func.isRequired
	}

	componentWillMount() {
		console.log("AppContainer mounted");
		
		const {stores: {app}, services: {dispatcher}} = this.context;
		const {router} = this.context;
		this.subscribe(app.dialog$, dialogs => this.setState({dialogs}));

		this.subscribe(
			dispatcher.onSuccess$(A.GAME_JOIN),
			action => {
				const path = `/game/${action.gameId}`
				if(router.route.location.pathname === path)
					return;

				router.history.push(path);
			});

		this.subscribe(
			dispatcher.onSuccess$(A.LOBBY_JOIN),
			() => {
				if(router.route.location.pathname==="/")
					return;

				router.history.push("/");
			});
	}

	render(){
		const {Main, Sidebar} = this.props;
		const {dialogs} = this.state;

		const dialogStack = dialogs.map(dialog => {
			const DialogComponent = dialogTypes[dialog.id];
			return <DialogComponent {...dialog.props} key={dialog.id} />;
		});

		return (
			<div className={`c-application ${dialogStack.length ? "dialogs-open" : "dialogs-closed"}`}>
				<div className="dialogs">
					{dialogStack}
				</div>
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
