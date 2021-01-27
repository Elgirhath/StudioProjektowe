import React from 'react'
import './popup-style.css';
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
			roundNumber: 1,
			roundMinute:1,
			roundSeconds:0,
			correctData: true,
			isPrivate: false,
			password: '',
			errorInfo: false,
		}
		
		this.handlePassword = this.handlePassword.bind(this);
		this.handleRoundNumber = this.handleRoundNumber.bind(this);
		this.handleRoundMinutes = this.handleRoundMinutes.bind(this);
		this.handleRoundSeconds = this.handleRoundSeconds.bind(this);
		this.handleNumbersOnly = this.handleNumbersOnly.bind(this);
		this.handleNumbersOnly2 = this.handleNumbersOnly2.bind(this);
		this.handleNumbersOnly3 = this.handleNumbersOnly3.bind(this);
	}

	handleNumbersOnly(event){
		if(event.keyCode<48 || event.keyCode>57){
			this.setState({roundNumber: ''});

		}
	}
	handleNumbersOnly2(event){
		if(event.keyCode<48 || event.keyCode>57){
			this.setState({roundMinute: ''});

		}
	}
	handleNumbersOnly3(event){
		if(event.keyCode<48 || event.keyCode>57){
			this.setState({roundSeconds: ''});

		}
	}
	handlePassword(event){
		this.createBody();
		this.setState({password: event.target.value})
	}
	handleRoundNumber(event){
		this.setState({roundNumber: event.target.value})
	}
	handleRoundMinutes(event){
		this.setState({roundMinute: event.target.value})
	}
	handleRoundSeconds(event){
		this.setState({roundSeconds: event.target.value})
	}

	getRoundDuration() {
		return parseInt(this.state.roundMinute * 60) + parseInt(this.state.roundSeconds);
	}

	createBody(){
		var body = {
			"PlayerOwnerId": (cookies.get('user')).id,
			"PlayerOwnerName": (cookies.get('user')).userName,
			"RoundDuration": this.getRoundDuration(),
			"IsPrivate":this.state.isPrivate,
			"RoundCount": this.state.roundNumber
		}
		if(this.state.isPrivate){
			body["Password"] = this.state.password;
		}
		return body;
	}
	
	async createTable(){

		try{
			const response = await fetch('http://'+ window.location.hostname+ ':'+address.kalamburyURL+address.room, {
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
			this.setState({errorInfo: true});
		}
	}
	
	render(){

		if(this.state.roundNumber==0){
			this.state.correctData=false;
		}else{
			if(this.state.roundMinute == 0){
				if(this.state.roundSeconds>=30 && this.state.roundSeconds<60){
					this.state.correctData=true;
				}else{
					this.state.correctData=false;
				}
			}else{
				if(this.state.roundSeconds>=0 && this.state.roundSeconds<60){
					this.state.correctData=true;
				}else{
					this.state.correctData=false;
				}
			}
		}
		const {
			privateTable,
		 	handlePrivateTable,
		 	handlePublicTable,
		      continueFunc
    	} = this.props;
		return(
			<div className="popup-container">
			{this.state.errorInfo ? <ErrorInfo {...{
				visible: ()=>{this.setState({errorInfo:false})}
			}}/> : null}
				<h2 className="popup-title">Ustawienia</h2>
				<div className="popup-tile vertical">
					<label className="type"><span className={this.props.privateTable ? "settings-radio" : "settings-radio selected"} onClick={() => {this.state.isPrivate = false; this.props.handlePublicTable();}}></span><input type="radio" name="tableType"  />publiczny</label>
					<label className="type"><span className={!this.props.privateTable ? "settings-radio" : "settings-radio selected"} onClick={() => {this.state.isPrivate = true; this.props.handlePrivateTable();}}></span><input type="radio" name="tableType" />prywatny</label>
				</div>
				<div className={classNames({
					'popup-tile': true,
					'public-table': !this.state.isPrivate
				})}>
					<div className="settings-password">
						<p>Podaj swoje hasło do pokoju</p>
						<span><input type="text" className="password-input" onChange={this.handlePassword} value={this.state.password}/></span>
					</div>
				</div>
				<div className="popup-tile">
					<div>
						<label>ilość tur <span><input type="text" className="popup-input" onKeyUp={this.handleNumbersOnly} onChange={this.handleRoundNumber} value={this.state.roundNumber}/></span></label>
						<p>czas trwana tury <span><input type="text" className="time-input" onKeyUp={this.handleNumbersOnly2} value={this.state.roundMinute} onChange={this.handleRoundMinutes}/> : <input type="text"className="time-input" onKeyUp={this.handleNumbersOnly3} value={this.state.roundSeconds}  onChange={this.handleRoundSeconds}/></span></p>
					</div>
				</div>
				{this.state.correctData ? <button onClick={() => {this.createTable();}}>kontynuuj</button>: <div><p className="error popup-tile">Uzupełnij prawidłowo formularz</p> <button disabled>Kontunuuj</button></div>}
			</div>
			)
	}
	
}
export default GameSettings