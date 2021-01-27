import React from 'react'
import './settings-style.css';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import address from '../configuration.json';
import classNames from "classnames";
import ErrorInfo from './ErrorInfo.jsx';
const cookies = new Cookies();
class GameSettings extends React.Component{
	static propTypes = {
  	privateTable: PropTypes.bool,
    continueFunc: PropTypes.func.isRequired,
    handlePublicTable: PropTypes.func.isRequired,
    handlePrivateTable:PropTypes.func.isRequired
   
  };
  static defaultProps = {
   	privateTable: false,
   	handlePrivateTable: () =>{},
   	handlePublicTable: ()=>{},
    continueFunc: () => {}
  };
	constructor(...props){
		super(...props);
		this.state = {
			minutes: 5,
			seconds: 0,
			isValid: true,
			isPrivate: false,
			password: '',
			color:'white'
		}
	}

	validateMinuteInput = (event) => {
		if (event.keyCode == 8) return
		if (event.keyCode >= 48 && event.keyCode <= 57) return

		this.setState({minutes: ''});
	}

	validateSecondInput = (event) => {
		if (event.keyCode == 8) return
		if (event.keyCode >= 48 && event.keyCode <= 57) return
		
		this.setState({seconds: ''});
	}

	setPassword = (event) => {
		this.setState({password: event.target.value})
	}

	setMinutes = (event) => {
		this.setState({minutes: event.target.value})
	}

	setSeconds = (event) => {
		this.setState({seconds: event.target.value})
	}

	setColor = (str) => {
		this.setState({color:str});
	}

	getRoundDuration() {
		return parseInt(this.state.minutes * 60) + parseInt(this.state.seconds);
	}
	createBody(){
		var body = {
			"PlayerOwnerId": (cookies.get('user')).id,
			"PlayerOwnerName": (cookies.get('user')).userName,
			"RoundDuration": this.getRoundDuration(),
			"IsPrivate":this.state.isPrivate
		}
		if(this.state.isPrivate){
			body["Password"] = this.state.password;
		}
		return body;
	}
	
	async createTable(){
		try{
			const fetchAddress = "http://" + window.location.hostname + ':' + address.chessBackendPort + address.room + '/' + this.state.color
			const response = await fetch(fetchAddress, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json' 
				},
				body: JSON.stringify(this.createBody()),
			});

			if(!response.ok){
				throw Error(response.statusText);
			}

			const json = await response.json();

			this.props.continueFunc(json);
		} catch(error){
			console.error(error);
			console.trace();
			
			this.setState({errorInfo: true});
		}
	}

	async componentDidUpdate() {
		var isValid = this.validate()
		if (isValid != this.state.isValid) {
			this.setState({isValid: isValid});
		}
	}

	validate() {
		if (this.state.minutes > 600) return false
		if (this.state.minutes == 600) return this.state.seconds == 0
		if (this.state.minutes == 0) {
			return this.state.seconds>=10 && this.state.seconds<60
		} else {
			return this.state.seconds>=0 && this.state.seconds<60
		}
	}

	isWhiteSelected() {
		return this.state.color == "white"
	}
	
	render(){
		const {
			privateTable,
		 	handlePrivateTable,
		 	handlePublicTable,
		      continueFunc
    	} = this.props;
		return(
			<div className="settings-container">
			{this.state.errorInfo ? <ErrorInfo {...{
				visible: ()=>{this.setState({errorInfo:false})}
			}}/> : null}
				<h2 className="settingsTitle">Ustawienia</h2>
				<div className="settingsTile vertical">
					<label className="type"><span className={this.props.privateTable ? "settingsRadio" : "settingsRadio selected"} onClick={() => {this.state.isPrivate = false; this.props.handlePublicTable();}}></span><input type="radio" name="tableType"  />publiczny</label>
					<label className="type"><span className={!this.props.privateTable ? "settingsRadio" : "settingsRadio selected"} onClick={() => {this.state.isPrivate = true; this.props.handlePrivateTable();}}></span><input type="radio" name="tableType" />prywatny</label>
				</div>
				<div className={classNames({
					settingsTile: true,
					publicTable: !this.state.isPrivate
				})}>
					<div className="settingsPassword">
						<p>Podaj swoje hasło do pokoju</p>
						<span><input type="text" className="passwordInput" onChange={this.setPassword} value={this.state.password}/></span>
					</div>
				</div>
				<div className="settingsTile">
					<div>
						
						<p>czas na ruch <span><input type="text" className="timeInput" onKeyUp={this.validateMinuteInput} value={this.state.minutes} onChange={this.setMinutes}/> : <input type="text"className="timeInput" onKeyUp={this.validateSecondInput} value={this.state.seconds}  onChange={this.setSeconds}/></span></p>
						<p>kolor pionka <span><span onClick={()=>{this.setColor("white")}} className={this.isWhiteSelected() ? "color-selector white selected" : "color-selector white"}></span> <span onClick={()=>{this.setColor("black")}} className={this.isWhiteSelected() ? "color-selector black" : "color-selector black selected"}></span></span></p>
					</div>
				</div>
				{this.state.isValid ? <button onClick={() => {this.createTable();}}>kontynuuj</button>: <div><p className="error settingsTile">Nieprawidłowe dane</p> <button disabled>Kontunuuj</button></div>}
			</div>
			)
	}
	
}
export default GameSettings