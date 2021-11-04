import "./app.scss";

import React, {Component} from "react";
import PropTypes from 'prop-types';

class AppContainer extends Component {
	static propTypes = {
		Main: PropTypes.func.isRequired,
		Sidebar: PropTypes.func.isRequired
	}

	componentDidMount() {
		console.log("App mounted");
	}
	render(){
		const {Main, Sidebar} = this.props;
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
