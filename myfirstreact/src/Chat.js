import React, { Component } from 'react';
import * as signalR from "@microsoft/signalr";
import { array } from 'prop-types';

class Chat extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
        nick: '',
        id: '',
        message: '',
        messages: [],
        hubConnection: null,
        char: '',
        int: 0,
        roomId: '',
        gameStatus: null,
        board: null
      };
  }


  createBoard() {
    if(this.state.gameStatus != null){
      var board = this.state.gameStatus.boards[0].playerId == this.state.id ?  this.state.gameStatus.boards[0] : this.state.gameStatus.boards[1];
      board.board[0][0].isShip = true;
      board.board[0][0].ShipType = 0;

      board.board[2][3].isShip = true;
      board.board[2][3].ShipType = 1;
      board.board[2][4].isShip = true;
      board.board[2][4].ShipType = 1;
      board.areShipsAllocated = true;
    }
    this.state.board = board;
    console.log(this.state.board);
  }
  componentDidMount = () => {
    const nick = window.prompt('Your name:', 'Sylwia');
    const id = window.prompt('Your Id:', 'a0e38bfa-0df4-4374-9fbb-57e68902d8c7');
    const roomId = window.prompt('Your roomId:', '1');

    const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:5003/shipsHub")
    .configureLogging(signalR.LogLevel.Information)  
    .build();

    this.setState({ hubConnection, nick, id, roomId }, () => {
        this.state.hubConnection
          .start()
          .then(() => console.log('Connection started!'))
          .catch(err => console.log('Error while establishing connection :('));
  
        this.state.hubConnection.on('ReceiveMessage', (nick, receivedMessage) => {
          const text = `${nick}: ${receivedMessage}`;
          const messages = this.state.messages.concat([text]);
          this.setState({ messages });
        });

        this.state.hubConnection.on('Send', (receivedMessage) => {
            const text = `server: ${receivedMessage}`;
            const messages = this.state.messages.concat([text]);
            this.setState({ messages });
          });

        this.state.hubConnection.on('GameStatus', (status) => {
          this.state.gameStatus = status;
              console.log(status);
          });

        this.state.hubConnection.on('Points', (points) => {
            console.log(points);
        });
      });
    }

sendMessage = () => {
    this.state.hubConnection
      .invoke('SendMessage', this.state.nick, this.state.message)
      .catch(err => console.error('sendMessage' , err));
  
      this.setState({message: ''});      
  };

  shoot = () => {
    console.log('Shoot', this.state.roomId+'', this.state.id, this.state.nick, this.state.char, this.state.int);
    this.state.hubConnection
      .invoke('Shoot', this.state.roomId+'', this.state.id, this.state.nick, this.state.char, +this.state.int)
      .catch(err => console.error(err));
  };

  alocateShips = () => {
    this.createBoard();

    this.state.hubConnection
      .invoke('AlocateShips', this.state.roomId, this.state.board)
      .catch(err => console.error(err));
  };

  addToGame = () => {
    this.state.hubConnection
      .invoke('AddToGameGroup', this.state.roomId, this.state.id, this.state.nick)
      .catch(err => console.error('addToGame', err));
  
      this.setState({message: ''});
  };

  removeFromGame = () => {
    this.state.hubConnection
      .invoke('RemoveFromGameGroup',this.state.roomId, this.state.id, this.state.nick)
      .catch(err => console.error(err));
  
      this.setState({message: ''});  
  };

 
  render() {
    return (
        <div>
      <br />
      <input
        type="text"
        value={this.state.message}
        onChange={e => this.setState({ message: e.target.value })}
      />

      <button onClick={this.sendMessage}>Send</button>
      <button onClick={this.addToGame}>Add</button>

      <div>
      <label>charCoordinates</label>
      <input
        type="text"
        value={this.state.word}
        onChange={e => this.setState({ char: e.target.value })}
      />
      <label>intCoordinates</label>
      <input
        type="text"
        value={this.state.word}
        onChange={e => this.setState({ int: e.target.value })}
      />
      </div>

      <button onClick={this.shoot}>Shoot</button>
      <button onClick={this.alocateShips}>Alocate Ships</button>

      <div>
        {this.state.messages.map((message, index) => (
          <span style={{display: 'block'}} key={index}> {message} </span>
        ))}
      </div>
    </div>
    ); 
  } 
}

export default Chat;