import React from 'react';
import '../views/game-styles.css'
import UserPanel from './UserPanel.jsx';
import GameSettings from './GameSettings.jsx';
import KeyInfo from './KeyInfo.jsx';
import GameView2 from "../components/GameView2.jsx";
import Cookies from 'universal-cookie';
import address from '../configuration.json';
import * as signalR from "@microsoft/signalr";
import ReactPaint from './ReactPaint.jsx';
import EndGamePopup from './EndGamePopup.jsx';
import ErrorInfo from './ErrorInfo.jsx';
import history from '../history.jsx';
const cookies = new Cookies();


class GameScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      color: '#ffffff',
      clear: false,
      width: window.innerWidth * 0.9 * 0.55 - 20,
      height: window.innerHeight * 0.6,
      message: '',
      settings: true,
      privateTable: false,
      keyView: false,
      key: 'XXXXXXXX',	//do pobrania
      table: '',
      hubConnection: null,
      user: '',
      messages: [],
      gameStatus: '',
      currentHint: '',
      players: [],
      points: '',
      canvas: '',
      gameFinished:  false,
      roomExists: true,
      gameStarted: true,
      errorInfo:false,

    }

    // this.handleClear = this.handleClear.bind(this);
    // this.handleChangeColor = this.handleChangeColor.bind(this);
    // this.handleSendMessage = this.handleSendMessage.bind(this);
    // this.handleMessage = this.handleMessage.bind(this);
  }
  async componentDidMount(){
    var currTable = cookies.get('currentTable');
    if(currTable != ''){
      this.state.table = currTable;
      await this.startGame();
    }
  }

  addPoints(){
    console.log(this.state.players);
    if(this.state.players != []){
      this.state.players.forEach((plr) => {
        console.log(plr.id);
        if(this.state.points[plr.id] != undefined){
          plr['points'] = this.state.points[plr.id];
        }
      });
    }
    console.log(this.state.players);
  }

  async getPlayers(){
    try{
      const response = await fetch('https://'+address.chineseURL+address.room+'/'+this.state.table.id, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if(!response.ok){
        throw Error(response.statusText);
      }
      const data = await response.json();
      console.log('data', data);
      // if(data.players == undefined){
      //   this.setState({roomExists: false});
      // } else {
      //   this.state.players = await data.players;
      //   this.addPoints();
      // }

    } catch(error){
      this.setState({errorInfo: true});
    }
  }

  async startGame(){
    try{
      const startGame = await fetch('https://'+address.chineseURL+address.game+'/'+this.state.table.id,{
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if(!startGame.ok){
        throw Error(startGame.statusText);
      }
    }catch(Error){
      this.setState({errorInfo: true});
    }
    this.connectToRoom();
  }
  async submitForDrawing(){
    try{
      const response = await fetch('https://'+address.chineseURL+address.game+'/'+this.state.table.id+'/drawing/'+this.user.id, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "GameId": this.state.table.id,
          "PlayerId": this.user.id,
        }),
      });

      if(!response.ok){
        throw Error(response.statusText);
      }

      const json = await response.json();
    } catch(error){

    }
  }

  saveMessages(author, receivedMessage){
    if(receivedMessage !== 'Update status by contexthub.' && receivedMessage !== ''){
      this.state.messages.push({author, receivedMessage});
    }
  }
  addHint(hint){
    if(this.state.currentHint !== hint){
      this.setState({currentHint: hint});
      this.saveMessages('hint', hint);
    }
  }


  async connectToRoom(){
    this.getPlayers();
    console.log('I was triggered during render'+this.getPlayers().toString())
    var user = cookies.get('user');
    const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:5005/chineseHub")
        .configureLogging(signalR.LogLevel.Information)
        .build();

    console.log(hubConnection);
    this.setState({ hubConnection, user }, () => {
      this.state.hubConnection
          .start()
          .then(async () => {
            console.log('Connection started!');
            console.log(this.state.hubConnection.connection.connectionState);
            //this.addToGame();
            if(this.isCurrentPlayerOwner()){
              this.addOwnerToGame();

            } else {
              this.addToGame();
               // this.hubConnection.invoke('AddNormalUserToGameGroup', `${this.state.table.id}`, user.id, user.userName);
            }
            await this.submitForDrawing();
          })
          .catch(err => {console.log('Error while establishing connection :('); this.setState({errorInfo: true});});

      this.state.hubConnection.on('ReceiveMessage', (nick, receivedMessage) => {
        this.saveMessages(nick, receivedMessage);
      });

      this.state.hubConnection.on('Send', async (receivedMessage) => {
        console.log('send', receivedMessage);
        await this.getPlayers();
        this.saveMessages('server', receivedMessage);
        if(receivedMessage == 'Koniec gry'){
          this.setState({gameFinished: true});
        }
      });

      this.state.hubConnection.on('GameStatus', (status) => {
        console.log('GameStatus ', status);
        this.setState({gameStatus: status});
        this.setState({gameStarted: true});
        // if(status.canvas != ''){
        //   this.setState({canvas: status.canvas});
        // }
        // if(status.hint !== ''){
        //   this.addHint(status.hint);
        // }
        // console.log(status);
      });

      this.state.hubConnection.on('Points', async (points) => {
        this.state.points = points;
        await this.getPlayers();
        this.setState({canvas: ''});
        console.log(points);
      });
    });
  }

  // sendWord = () => {
  //   this.state.hubConnection
  //       .invoke('CheckGivenWord', `${this.state.table.id}`, {Word: this.state.message, PlayerId: `${cookies.get('user').id}`, PlayerName: `${cookies.get('user').userName}`})
  //       .catch(err => {console.error(err); this.setState({errorInfo: true});});
  //   this.setState({word: ''});
  // }

  addToGame = () => {
    console.log('AddToGameGroup', `${this.state.table.id}`, this.state.user.id, this.state.user.userName)
      this.state.hubConnection
          .invoke('AddToGameGroup', `${this.state.table.id}`, this.state.user.id, this.state.user.userName)
          .catch(err => {
            console.error(err);
            this.setState({errorInfo: true});
          });
  }

  addOwnerToGame = () => {
    console.log('AddToGameGroup', `${this.state.table.id}`, this.state.user.id, this.state.user.userName)
    this.state.hubConnection
        .invoke('AddOwnerToGameGroup', `${this.state.table.id}`, this.state.user.id, this.state.user.userName)
        .catch(err => {
          console.error(err);
          this.setState({errorInfo: true});
        });
  }
  sendMessage = () => {
    this.state.hubConnection
        .invoke('SendMessage', this.state.user.userName, this.state.message)
        .catch(err => {console.error(err); this.setState({errorInfo: true});});
    this.setState({message: ''});
  }

  // sendGameStatus = (status) => {
  //     this.state.hubConnection
  //         .invoke('SendGameStatus', this.state.table.id+'', status)
  //         .catch(err => {console.error(err); this.setState({errorInfo: true});});
  //   }
  // }
  //
  // isCurrentUserDrawing(){
  //   return this.state.gameStatus === '' ? false : this.state.gameStatus.currentPlayerId == cookies.get('user').id;
  // }

  // handleChangeColor(str){
  //   this.setState({clear: false});
  //   this.setState({color: str});
  // }
  // handleClear(){
  //   this.setState({clear: true});
  // }
  // handleMessage(event){
  //   this.setState({message:event.target.value});
  // }
  // handleSendMessage(event){
  //   if(event.keyCode==13){
  //     this.sendMessage();
  //     this.sendWord();
  //     this.setState({message:''});
  //   }
  //
  // }

  handleContinue(table){
    this.setState({table: table});
    this.startGame();
  }
  // handleKey(){
  //   this.setState({keyView:false});
  // }
  //
  // displayCanvas(){
  //   return (
  //       <div className="received-canvas">
  //         <img src={this.state.canvas} />
  //       </div>
  //   );
  // }

  isTableSet(){
    return this.state.table !== '';
  }

  getTime(){
    if(this.state.table == ''){
      return '';
    }else if(this.state.gameStatus.roundTime == undefined){
      return '';
    }else {
      return parseInt(this.state.table.roomConfiguration.roundDuration,10) - this.state.gameStatus.roundTime;
    }
  }

  isCurrentPlayerOwner(){
    return this.state.user.id == this.state.table.roomConfiguration.playerOwnerId;
  }

  renderPlayers(){
    if(this.state.players != undefined){
      return this.state.players.map((plr, index) =>
          <UserPanel {...{
            userName: plr.name,
            points: plr.points,
            panelType: index % 4 + 1,
          }}/>
      )
    }
  }

  Colors(){
    return(
        <div className="colors-panel">
          <div className="color clear" onClick={this.handleClear} ></div>
          <div className="color" style={{background: '#ffffff'}} onClick={(str) => this.handleChangeColor('#ffffff')}></div>
          <div className="color" style ={{background: "#e400f6"}} onClick={(str) => this.handleChangeColor('#e400f6')}></div>
          <div className="color" style={{background: '#ffc865'}} onClick={(str) => this.handleChangeColor('#ffc865')} ></div>
          <div className="color" style={{background: '#00ee32'}}  onClick={(str) => this.handleChangeColor('#00ee32')}></div>
          <div className="color" style={{background: '#00e1ea'}} onClick={(str) => this.handleChangeColor('#00e1ea')}></div>
        </div>
    )
  }

  async removeUserFromRoom(){
    var user = cookies.get('user');
    try{
      const response = await fetch('https://'+address.chineseURL+address.room+'/'+this.state.table.id+'/'+user.id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if(!response.ok){
        throw Error(response.statusText);
      }

      const json = await response.json();
      console.log(json);
    } catch(error){
      this.setState({errorInfo: true})
    }
  }

  async removeRoomAsOwner(){
    var user = cookies.get('user');
    try{
      const response = await fetch('https://'+address.chineseURL+address.room+'/'+this.state.table.id+'/owner/'+user.id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if(!response.ok){
        throw Error(response.statusText);
      }

      const json = await response.json();
      console.log(json);
    } catch(error){
      this.setState({errorInfo: true})
    }
  }

  deleteUserFromHub(){
    this.state.hubConnection
        .invoke('RemoveFromGameGroup', `${this.state.table.id}`, this.state.user.id, this.state.user.userName)
        .catch(err => {console.error(err);this.setState({errorInfo: true}) });
  }

  resetView(){
    cookies.set('currentTable', '', { path: '/' });
    history.push('/tables');
  }

  async handleEndGame(){
    await this.removeUserFromRoom();
    this.deleteUserFromHub();

    if(this.isCurrentPlayerOwner()){
      console.log(this.isCurrentPlayerOwner());
      await this.removeRoomAsOwner();
    }
    this.resetView();
  }

  async restartGame(){
    var user = cookies.get('user');
    try{
      const response = await fetch('https://'+address.chineseURL+address.game+'/'+this.state.table.id+'/restart', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if(!response.ok){
        throw Error(response.statusText);
      }

      const json = await response.json();
      console.log(json);
    } catch(error){
      this.setState({errorInfo: true})
    }
  }

  async handleContinueGame(){
    await this.restartGame();
    this.setState({gameFinished: false});
  }

  ownerLeftGame(){
    return 	<div className="popup-container">
      <h2 className="popup-title">Własciciel gry opuścił pokój. </h2>
      <h2 className="popup-title">Koniec gry.</h2>
      <div>
        <button onClick={()=>this.handleEndGame()}>Powrót</button>
      </div>
    </div>
  }

  waitingForPlayers(){
    return 	<div className="popup-container">
      <h2 className="popup-title">Oczekiwanie na innych graczy </h2>
    </div>
  }

  renderScreen(){
    console.log(this.state);
    if(this.isTableSet()){
      if(!this.state.roomExists){
        console.log(this.state.roomExists)
        return this.ownerLeftGame();
      }
      else if(!this.state.gameStarted){
        return this.waitingForPlayers();
      }
      else if(this.state.gameFinished){
        return <EndGamePopup
            players={this.state.players}
            handleEndGame={()=>this. handleEndGame()}
            handleContinue={()=>this.handleContinueGame()}
        />;
       }
      else {
        //gameStatus={this.state.gameStatus}
        return <GameView2
            gameStatus={null}
            onGameStatusChange={(status) => console.log(status)}
        />
      }// else{
      //   return this.displayCanvas();
      // }
     } else{
       return <GameSettings {...{
         handlePrivateTable: () => {this.setState({privateTable:true})},
         handlePublicTable: () => {this.setState({privateTable:false})},
         continueFunc: (str)=>{this.handleContinue(str)},
         privateTable: this.state.privateTable

       }} />
     }
  }

  render(){
    console.log(this.state.errorInfo)
    return(

        <div className="gameScreen">
          {this.state.errorInfo ? <ErrorInfo {...{
            visible: ()=>{this.setState({errorInfo:false})}
          }}/> : null}
          {/*<div className={!this.isCurrentUserDrawing() || this.state.gameFinished ? 'hide-header' : '' + "game-header"}><p className='game-title'>{this.state.gameStatus.word}</p>{this.Colors()}<div className="time-counter"><p>{this.getTime()}</p></div></div>*/}
          <div className="game-container">
            <div className="players-list">
              {this.renderPlayers()}
            </div>
            <div className="main-game">
              {this.renderScreen()}
            </div>
            <div className="game-chat">
              <div className="messages">
                <ul>
                  {this.state.messages.map(arg =>
                      <li key={arg.receivedMessage}>
                        <p><span className="message-author">{arg.author}:</span> {arg.receivedMessage}</p>
                      </li>
                  )}
                </ul>
              </div>
              {/*<input type="text" className="chat-input" onChange={this.handleMessage} onKeyUp={this.handleSendMessage} value={this.state.message}/>*/}
            </div>
          </div>
        </div>
    )
  }

}
export default GameScreen;