import React from 'react';
import UserPanel from './UserPanel.jsx'
import ChessBoard from './ChessBoard.jsx'
import ChessHub from './ChessHub.jsx';
import GameSettings from './GameSettings.jsx'
import EndGamePopup from './EndGamePopup.jsx';
import Chat from './Chat.jsx';
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
			color: '',
			privateTable:false,
			table: '',
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
			isDrawOfferBlocked: false
		}

		this.handleDraw = this.handleDraw.bind(this);
		this.handleResignation = this.handleResignation.bind(this);
	}

	async componentWillMount(){
		this.state.table = cookies.get('currentTable');

		this.hub = await ChessHub.getInstance();

		if(this.state.table != ''){
			await this.startGame();
		}
	}
		
	updatePoints(){
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
			const fetchAddress = "http://" + window.location.hostname + ':' + address.chessBackendPort + address.room + '/' + this.state.table.id
            const response = await fetch(fetchAddress, {
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
				this.updatePoints();
			}
			
		} catch(error){
			console.error(error);
			console.trace();

			this.setState({errorInfo: true});
		}
	}

	onServerMessage = async (message) => {
		await this.fetchPlayers();
		if(message == 'Koniec gry'){ 
			this.setState({gameFinished: true});
		}
		else if(message.substring(message.length-18)=="has left the game."){
			this.setState({playerLeft:true})
		}
	}

	async setupHub() {
		this.hub.onMessage((userName, receivedMessage) => {
			this.saveMessages(userName, receivedMessage);
		});
		
		this.hub.onGameStatus((status) => {
			this.setState({gameStatus: status});
			if (status.isFinished) {
				this.setState({gameFinished: true})
			}
			this.setState({gameStarted: true});
		});
		
		this.hub.onPoints(async (points) => {
			this.setState({points: points});
			this.updatePoints();
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
			const fetchAddress = "http://" + window.location.hostname + ':' + address.chessBackendPort + address.game + '/' + this.state.table.id
			const gameStartResponse = await fetch(fetchAddress,{
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

	handleBoardChange = (status) => {
		var gameStatusCopy = Object.assign({}, this.state.gameStatus);

		gameStatusCopy.board = status.board;

		if (status.finished) {
			gameStatusCopy.isFinished = true;

			if (status.result == "draw") {
				gameStatusCopy.result = "draw"
			}
			else {
				gameStatusCopy.result = this.state.players.filter(p => p.color === status.result)[0].id
			}

			this.setState({gameStatus: gameStatusCopy});
			this.hub.sendGameStatus(this.state.table, gameStatusCopy)
		}
		else {
			this.hub.sendBoard(this.state.table, gameStatusCopy)
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

	getTime(color){
		if(color == "white" && this.state.gameStatus.whiteClock != undefined) {
			return this.state.gameStatus.whiteClock;
		}
		else if(this.state.gameStatus.blackClock != undefined) {
			return this.state.gameStatus.blackClock;
		}

		if(this.state.table != '') return this.state.table.roomConfiguration.roundDuration;

		return 0
	}

	isTableSet(){
		return this.state.table !== '';
	}

	handleContinue(table){
		this.setState({table: table});
		cookies.set('currentTable', table, { path: '/' });
		this.props.onTableSet(table.id)
		this.startGame();
	}

	isCurrentUserMove(){
		return this.state.gameStatus === '' ? false : this.state.gameStatus.currentPlayerId == cookies.get('user').id;
	}

	async removeRoomAsOwner(){
		var user = cookies.get('user');
        try{
            const response = await fetch("http://" + window.location.hostname + ':' + address.chessBackendPort+address.room+'/'+this.state.table.id+'/owner/'+user.id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                }
            });

            if(!response.ok){
                throw Error(response.statusText);
            }

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

	async handleEndGame() {
		await this.removeUserFromRoom();
		this.hub.deleteUserFromHub(this.state.table, this.state.user);
		
		if(this.isCurrentPlayerOwner()){
			
			await this.removeRoomAsOwner();
		}
		this.resetView();
	}

	async restartGame() {
		var user = cookies.get('user');
        try{
            const response = await fetch("http://" + window.location.hostname + ':' + address.chessBackendPort+address.game+'/'+this.state.table.id+'/restart', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                }
            });

            if(!response.ok){
                throw Error(response.statusText);
            }
		} catch(error){
			console.error(error)
			console.trace();
		}
	}
	async removeUserFromRoom(){
		var user = cookies.get('user');
        try{
            const response = await fetch("http://" + window.location.hostname + ':' + address.chessBackendPort+address.room+'/'+this.state.table.id+'/'+user.id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                }
            });

            if(!response.ok){
                throw Error(response.statusText);
            }
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
		var gameStatusCopy = Object.assign({}, this.state.gameStatus);

		gameStatusCopy.drawAccepted = true;

		this.setState({gameStatus: gameStatusCopy})
		this.hub.sendGameStatus(this.state.table, gameStatusCopy);
		this.hub.sendMessage(this.state.user, "Remis przyjęty");
	}

	refuseDrawOffer() {
		var gameStatusCopy = Object.assign({}, this.state.gameStatus);

		gameStatusCopy.drawOffered = false;
		gameStatusCopy.drawAccepted = false;

		this.setState({gameStatus: gameStatusCopy})
		this.hub.sendGameStatus(this.state.table, gameStatusCopy);
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
					handleEndGame={()=>this.handleEndGame()}  
					handleContinue={()=>this.handleContinueGame()}
					playAgainDisabled={this.state.playerLeft}
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

	renderPlayers(){
		if(this.state.players != undefined){

			// make sure user is displayed first
			var playersOrdered = this.state.players
			if (this.state.user && this.state.players[0].id != this.state.user.id) {
				playersOrdered = this.state.players.slice().reverse()
			}

			return playersOrdered.map((plr, index) => 
					<div className={"player"+index+1}>
								<div className="player">
								<UserPanel {...{
									userName: plr.name,
									points: plr.points,
									color: plr.color,
									active: this.state.gameStatus.currentPlayerId == plr.id
								}}/>
								</div>
								{<div className="playerTime">{this.convertTime(this.getTime(plr.color))}</div> }
							</div>				
			)
		}
	}

	handleDraw(){
		this.state.gameStatus.drawOffered = true;
		this.disableDrawOfferTemporarly()
		this.setState({sendRemisOffer:true});
		this.hub.sendGameStatus(this.state.table, this.state.gameStatus);
		this.hub.sendMessage(this.state.user, "Propozycja remisu");
	}
	
	handleResignation(){
		this.state.gameStatus.resignedPlayerId = this.state.user.id;
		this.hub.sendGameStatus(this.state.table, this.state.gameStatus);
	}

	disableDrawOfferTemporarly() {
		this.setState({isDrawOfferBlocked: true})
		setTimeout(() => {
			this.setState({isDrawOfferBlocked: false})
		}, 5000)
	}

	renderControlPanel(){
		if (!this.state.gameStarted || this.state.isDrawOfferBlocked) {
			return(
				<div className="game-control">
					<button className="game-control-button" onClick={this.handleDraw} disabled>
						Remis
					</button>
					<button className="game-control-button" onClick={this.handleResignation} disabled>
						Rezygnacja
					</button>
				</div>)
		}
		else {
			return(
				<div className="game-control">
					<button className="game-control-button" onClick={this.handleDraw}>
						Remis
					</button>
					<button className="game-control-button" onClick={this.handleResignation}>
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
						<Chat onServerMessage={this.onServerMessage}/>

				</div>
			</div>
		
			)
	}

}
export default GameScreen;