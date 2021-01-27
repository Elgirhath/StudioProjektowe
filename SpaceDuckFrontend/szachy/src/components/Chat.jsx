import React, { useRef} from 'react';
import ChessHub from './ChessHub.jsx';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            currentMessage: '',
            user: ''
        }

    }
    

	saveMessages(author, receivedMessage){
		if(receivedMessage !== 'Update status by contexthub.' && receivedMessage !== ''){
			this.state.messages.push({author, receivedMessage});
			this.forceUpdate();
		}
	}
    
	async componentDidMount() {
        this.chessHub = await ChessHub.getInstance();
        this.setupHub()
        this.setState({user: cookies.get('user')})
    }

    async componentDidUpdate() {
        this.scrollToBottom()
    }

    setupHub() {
        this.chessHub.onMessage((userName, receivedMessage) => {
            this.saveMessages(userName, receivedMessage);
        });
        

		this.chessHub.onServerMessage(async (receivedMessage) => {
            this.saveMessages('server', receivedMessage);
            
            this.props.onServerMessage(receivedMessage);
		});
    }

	handleMessageChange = (event) => {
		this.setState({currentMessage:event.target.value});
	}

	handleMessageKeyUp = (event) => {
		if(event.keyCode==13){
			this.chessHub.sendMessage(this.state.user, this.state.currentMessage);
			this.setState({currentMessage:''});
		}
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    render() {
        return(
            <div className="game-chat">
                <div className="messages">
                    <ul>
                        {this.state.messages.map(arg => 
                            <li key={arg.receivedMessage}>
                                <p><span className="message-author">{arg.author}:</span> {arg.receivedMessage}</p>
                            </li>
                        )}
                    </ul>
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                </div>
                <input type="text" className="chat-input" onChange={this.handleMessageChange} onKeyUp={this.handleMessageKeyUp} value={this.state.currentMessage}/>
            </div>
        )
    }
}