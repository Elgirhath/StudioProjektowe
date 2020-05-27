import React from 'react';
import UserPanel from './UserPanel.jsx'
import ChessBoard from './ChessBoard.jsx'
import ChessHub from './ChessHub.jsx';
import GameSettings from './GameSettings.jsx'
import EndGamePopup from './EndGamePopup.jsx';
import * as signalR from "@microsoft/signalr";
import Cookies from 'universal-cookie';
import address from '../configuration.json';
import history from '../history.jsx';
import ErrorInfo from './ErrorInfo.jsx';
import './popup-style.css';
const cookies = new Cookies();
class GameScreen extends React.Component{
	constructor(){
		super();
		this.state = {
			message:'',
			color: '',
			privateTable:false,
			table: '',
			hubConnection: null,
			user: '',
			messages: [],
			gameStatus: '',
			players: [],
			points: '',
			gameFinished:  false,
			roomExists: true,
			gameStarted: false,
			errorInfo:false,
			playerLeft:false,
			sendRemisOffer:false,
		}

		this.handleMessageChange = this.handleMessageChange.bind(this)
		this.handleMessageKeyUp = this.handleMessageKeyUp.bind(this);
		this.handleDraw = this.handleDraw.bind(this);
		this.handleResignation = this.handleResignation.bind(this);

		this.hub = ChessHub.getInstance();
	}

	async componentDidMount(){
		var currTable = cookies.get('currentTable');

		if(currTable != ''){
			this.state.table = currTable;
			await this.startGame();
		}
	}
		
	addPoints(){
		if(this.state.players != []){
			this.state.players.forEach((plr) => {
				if(this.state.points[plr.id] != undefined){
					plr['points'] = this.state.points[plr.id];
				}
			});
		}
	}

	async fetchPlayers(){
		try{
            const response = await fetch('https://'+address.szachyURL+address.room+'/'+this.state.table.id, {
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

			if(data.players == undefined){
				this.setState({roomExists: false});
			} else {
				this.state.players = await data.players;
				this.addPoints();
			}
			
		} catch(error){
			console.error(error);
			console.trace();

			this.setState({errorInfo: true});
		}
	}

	async setupHub() {
		await this.hub.init();

		this.hub.onServerMessage(async (receivedMessage) => {
			await this.fetchPlayers();
			this.saveMessages('server', receivedMessage);
			console.log(receivedMessage);
			if(receivedMessage == 'Koniec gry'){
				this.setState({gameFinished: true});
			}
			else if(receivedMessage.substring(receivedMessage.length-18)=="has left the game."){
				this.setState({playerLeft:true})
			}
		});
		
		this.hub.onMessage((userName, receivedMessage) => {
			this.saveMessages(userName, receivedMessage);
		});
		
		this.hub.onGameStatus((status) => {
			console.log(status);
			
			this.setState({gameStatus: status});
			this.setState({gameStarted: true});
		});
		
		this.hub.onPoints(async (points) => {
			this.state.points = points;
			await this.fetchPlayers();
		});
		
		this.hub.onError(async (err) => {
			console.error(err + " --------------- ");
		});

		if(this.isCurrentPlayerOwner()){
			this.hub.addOwnerToGame(this.state.table, this.state.user);
		} else {
			this.hub.addPlayerToGame(this.state.table, this.state.user);
		}
	}

	async startGame(){
		try{
			const gameStartResponse = await fetch('https://'+address.szachyURL+address.game+'/'+this.state.table.id,{
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json' 
				}
			});

			if(!gameStartResponse.ok){
				throw Error(gameStartResponse.statusText);
			}
			
			await this.fetchPlayers();

			var user = cookies.get('user')

			this.setState({ user: user }, this.setupHub);

			var color = this.state.players.find(p => p.id == user.id).color

			this.setState({color: color})
		} catch(error) {
			console.error(error)
			console.trace();

			this.setState({errorInfo: true});
		}
	}

	saveMessages(author, receivedMessage){
		if(receivedMessage !== 'Update status by contexthub.' && receivedMessage !== ''){
			this.state.messages.push({author, receivedMessage});
			this.forceUpdate();
		}
	}

	handleBoardChange = (status) => {
		var gameStatusCopy = Object.assign({}, this.state.gameStatus);
		gameStatusCopy.board = status.board;
		this.setState({gameStatus: gameStatusCopy});
		this.hub.sendBoard(this.state.table, gameStatusCopy)
	}

	handleMessageChange(event){
		this.setState({message:event.target.value});
	}

	handleMessageKeyUp(event){
		if(event.keyCode==13){
			this.hub.sendMessage(this.state.user, this.state.message);
			this.setState({message:''});
		}
	}

	getTime(){
		if(this.state.table == '') return '';
		if(this.state.gameStatus.roundTime == undefined) return '';
		
		return parseInt(this.state.table.roomConfiguration.roundDuration,10) - this.state.gameStatus.roundTime+1;
	}

	isTableSet(){
		return this.state.table !== '';
	}
	handleContinue(table){
		this.setState({table: table});
		cookies.set('currentTable', table, { path: '/' });
		this.startGame();
	}
	isCurrentUserMove(){
		return this.state.gameStatus === '' ? false : this.state.gameStatus.currentPlayerId == cookies.get('user').id;
	}
	async removeRoomAsOwner(){
		var user = cookies.get('user');
        try{
            const response = await fetch('https://'+address.szachyURL+address.room+'/'+this.state.table.id+'/owner/'+user.id, {
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
            
		} catch(error){
			console.error(error)
			console.trace();
		}
	}

	resetView(){
		cookies.set('currentTable', '', { path: '/' });
        history.push('/tables');
	}

	isCurrentPlayerOwner(){
		return this.state.user.id == this.state.table.roomConfiguration.playerOwnerId;
	}

	async handleEndGame(){
		await this.removeUserFromRoom();
		this.hub.deleteUserFromHub();
		
		if(this.isCurrentPlayerOwner()){
			
			await this.removeRoomAsOwner();
		}
		this.resetView();
	}
	async restartGame(){
		var user = cookies.get('user');
        try{
            const response = await fetch('https://'+address.szachyURL+address.game+'/'+this.state.table.id+'/restart', {
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
            
		} catch(error){
			console.error(error)
			console.trace();
		}
	}
	async removeUserFromRoom(){
		var user = cookies.get('user');
        try{
            const response = await fetch('https://'+address.szachyURL+address.room+'/'+this.state.table.id+'/'+user.id, {
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
            
		} catch(error){
			console.error(error)
			console.trace();
		}
	}

	async handleContinueGame(){
		await this.restartGame();

		this.setState({gameFinished: false});
	}

	ownerLeftGame(){
		return 	<div className="popup-container">
					<h2 className="popup-title">Właściciel gry opuścił pokój. </h2>
					<h2 className="popup-title">Koniec gry.</h2>
					<div>
						<button onClick={()=>this.handleEndGame()}>Powrót</button>
					</div>
				</div>
	}
	playerLeftGame(){
		return 	<div className="popup-container">
					<h2 className="popup-title">Przeciwnik opuścił pokój. </h2>
					<h2 className="popup-title">Koniec gry.</h2>
					<div>
						<button onClick={()=>this.handleEndGame()}>Powrót</button>
					</div>
				</div>
	}
	acceptDrawOffer(){
		this.state.gameStatus.drawAccepted = true;
		this.hub.sendGameStatus(this.state.table, this.state.gameStatus);
	}

	refuseDrawOffer(){
		this.state.gameStatus.drawAccepted = false;
		
		this.hub.sendGameStatus(this.status.table, this.state.gameStatus);
		this.hub.sendMessage(this.state.user, "Remis odrzucony");
	}

	drawOfferPopup(){
		return 	<div className="popup-container">
					<h2 className="popup-title">Przeciwnik proponuje remis</h2>
					
					<div>
						<button onClick={() => {this.acceptDrawOffer();}}>przyjmij</button>
						<button onClick={() => {this.refuseDrawOffer();}}>odrzuć</button>
				
					</div>
				</div>
	}

	waitingForPlayers(){
		return 	<div className="popup-container">
					<h2 className="popup-title">Oczekiwanie na innych graczy </h2>
				</div>
	}

	renderScreen(){
		if(this.isTableSet()){
			if(!this.state.roomExists){
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
			else if(this.state.gameStatus.drawOffered && !this.state.sendRemisOffer){
				return this.drawOfferPopup();
			}else if(this.state.playerLeft){
				if(this.state.roomExists){
					this.hub.deleteUserFromHub();
				
					if(this.isCurrentPlayerOwner()){
						
						 this.removeRoomAsOwner();
					}
				}
				return this.playerLeftGame();
			}else{
				return <ChessBoard
							color={this.state.color}
							onBoardChange={this.handleBoardChange}
							receivedFen={this.state.gameStatus.board}
						/> 
			}
		} else{
			return <GameSettings {...{
							handlePrivateTable: () => {this.setState({privateTable:true})},
							handlePublicTable: () => {this.setState({privateTable:false})},
							continueFunc: (str)=>{this.handleContinue(str)},
							privateTable: this.state.privateTable

						}} />
		}
	}

	convertTime(time){
		var min = Math.floor(time/60);
		var sec = time%60;
		if(sec<10){
			return(min+":0"+sec)
		}
		return(min+":"+sec)
	}

	renderPlayers(){
		if(this.state.players != undefined){
			return this.state.players.map((plr, index) => 
				
					<div className={"player"+index+1}>
								<div className="player">
								<UserPanel {...{
									userName: plr.name,
									points: plr.points,
									panelType: index+1,
									active: this.state.gameStatus.currentPlayerId == plr.id // obecny gracz
								}}/>
								</div>
								{this.state.gameStatus.currentPlayerId != plr.id ? <div className="playerTime">0:00</div> : <div className="playerTime">{this.convertTime(this.getTime())}</div> }
							</div>				
			)
		}
	}

	handleDraw(){
		this.state.gameStatus.drawOffered = true;
		this.setState({sendRemisOffer:true});
		this.hub.sendGameStatus(this.status.table, this.state.gameStatus);
	}
	
	handleResignation(){
		this.state.gameStatus.resigned = true;
		this.hub.sendGameStatus(this.status.table, this.state.gameStatus);
	}

	renderControlPanel(){

		if(this.isCurrentUserMove()){
			return(
			<div className="game-control">
			<button className="game-control-button" onClick={this.handleDraw}>
			Remis
			</button>
			<button className="game-control-button" onClick={this.handleResignation}>
				Rezygnacja
			</button>
			</div>)
		}else{
			return(
			<div className="game-control">
			<button className="game-control-button" disabled>
			Remis
			</button>
			<button className="game-control-button" disabled>
				Rezygnacja
			</button>
			</div>)
		}
		
		
	}
	render(){

		return(
			<div className="gameScreen"> 
				{this.state.errorInfo ? <ErrorInfo {...{
				visible: ()=>{this.setState({errorInfo:false})}
			}}/> : null}
					<div className="game-container">
						<div className="players-list">
						{this.renderPlayers()}
							
								{this.renderControlPanel()}
							
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
					<input type="text" className="chat-input" onChange={this.handleMessageChange} onKeyUp={this.handleMessageKeyUp} value={this.state.message}/>
				</div>

				</div>
			</div>
		
			)
	}

}
export default GameScreen;