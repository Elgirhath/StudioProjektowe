import Cookies from 'universal-cookie';
import address from '../configuration.json';
import * as signalR from "@microsoft/signalr";

const cookies = new Cookies();

class ChessHub {
	static instance = null;

	static async getInstance() {
		if (this.instance == null) {
			this.instance = new ChessHub();
			await this.instance.init()
		}
		return this.instance;
	}

	async init() {
		this.hubConnection = new signalR.HubConnectionBuilder()
			.withUrl("http://" + window.location.hostname + ':' + address.chessBackendPort + "/chessHub")
			.configureLogging(signalR.LogLevel.Information)  
			.build();
			
		await this.hubConnection.start()
	}

	onMessage(func) {
		this.hubConnection.on('ReceiveMessage', func);
	}

	onServerMessage(func) {
		this.hubConnection.on('Send', func);
	}

	onPoints(func) {
		this.hubConnection.on('Points', func);
	}
	
	onGameStatus(func) {
		this.hubConnection.on('GameStatus', func);
	}
	
	onError(func) {
		this.hubConnection.on('Error', func);
	}

	addPlayerToGame = (table, user) => {
		this.hubConnection
			.invoke('AddToGameGroup', `${table.id}`, user.id, user.userName);
	}
	
	addOwnerToGame = (table, user) =>{
		this.hubConnection
			.invoke('AddOwnerToGameGroup', `${table.id}`, user.id, user.userName);
	}

	sendMessage = (user, message) => {
		this.hubConnection
			.invoke('SendMessage', user.userName, message);
	}
	
	deleteUserFromHub(table, user){
		this.hubConnection
			.invoke('RemoveFromGameGroup', `${table.id}`, user.id, user.userName);
	}
	
	sendGameStatus(table, body) {
		this.hubConnection
			.invoke('SendGameStatus', table.id+'', body);
	}
	
	sendBoard(table, body) {
		this.hubConnection
			.invoke('SendBoard', table.id+'', body);
	}
}
export default ChessHub;