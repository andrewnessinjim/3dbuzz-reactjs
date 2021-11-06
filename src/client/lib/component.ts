import {Component, Children} from "react";
import PropTypes from "prop-types";

export class StoreProvider extends Component {
	props: {
		stores: object
		services: object
		children: any
	}

	static propTypes = {
		stores: PropTypes.object.isRequired,
		services: PropTypes.object.isRequired,
		children: PropTypes.object.isRequired
	};

	static childContextTypes = { //Declare context data to be passed into children
		stores: PropTypes.object.isRequired,
		services: PropTypes.object.isRequired
	}

	render() {
		return Children.only(this.props.children); //Throw exception if more than only child
	}

	getChildContext() {
		const {stores, services} = this.props;
		return {stores, services};
	}
}

export class ContainerBase extends Component {
	_disposeFunctions: Array<Function>

	static contextTypes = {
		stores: PropTypes.object.isRequired,
		services: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);
		this._disposeFunctions = [];
	}

	subscribe(observable$, callback) {
		const sub = observable$.subscribe(callback);
		this._disposeFunctions.push(() => sub.unsubscribe());
	}

	componentWillUnmount() {
		this._disposeFunctions.forEach(d => d());
		this._disposeFunctions = [];
	}

	dispatch(action) {
		this.context.services.dispatcher.emit(action);
	}

	request(action) {
		this.context.services.dispatcher.request(action);
	}
}