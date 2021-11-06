import "./chat.scss";

import React, {Component} from "react";
import PropTypes from 'prop-types';

import { TextInput } from "./controls";

/**
 * Every variable prefixed with op will have 4 fields:
 * 1. can: boolean indicating whether op is permitted for user
 * 2. inProgress: Is asynchronously executing?
 * 3. error
 * 4. hasFailed
 */

interface Op {
	can?: boolean,
	inProgress?: boolean,
	error?: string,
	hasFailed?: boolean
}

interface ChatProps {
	messages: any;
	opSendMessage: Op;
	sendMessage(message: string): void;

}
export default class Chat extends Component {

	_lastIndex: number;
	_sendMessage: (React.FormEventHandler<HTMLFormElement>);
	_text: any;
	_messages: any;
	props: ChatProps

	static propTypes = {
		messages: PropTypes.array.isRequired,
		opSendMessage: PropTypes.object.isRequired,
		sendMessage: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);

		this._lastIndex = -1;
		this._sendMessage = (e) => {
			const {opSendMessage, sendMessage} = this.props;
			e.preventDefault();

			if(!opSendMessage.can)
				return;

			const message = this._text.value.trim();
			if(message.length == 0)
				return;

			sendMessage(message);
			this._text.value = "";
		};
	}

	componentDidUpdate() {
		const {messages} = this.props;
		if(messages.length == 0)
			return;

		const newIndex = messages[messages.length - 1].index;
		if (this._lastIndex == newIndex) //No new messages were added
			return;

		this._messages.scrollTop = this._messages.scrollHeight;
		this._lastIndex = newIndex;
	}

	render() {
		const {messages, opSendMessage} = this.props;

		return (
			<section className="c-chat">
				<ul className="messages" ref={c => this._messages = c}>
					{messages.map(message => 
						<li key={message.index}>
							<span className="author">{message.name}</span>
							<span className="message">{message.message}</span>
						</li>
					)}
				</ul>
				<form onSubmit={this._sendMessage}>
					<TextInput
						className="top-border"
						placeholder={opSendMessage.can? "Enter a message" : "Please login to chat"}
						ref={c => this._text = c}
						disabled={!opSendMessage.can}/>
				</form>
			</section>
		);
	}
}