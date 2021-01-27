import React from 'react'
import './settings-style.css';
import PropTypes from 'prop-types';
class Pawn extends React.Component{
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
		}

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
	handleRoundNumber(event){
		this.setState({roundNumber: event.target.value})
	}
	handleRoundMinutes(event){
		this.setState({roundMinute: event.target.value})
	}
	handleRoundSeconds(event){
		this.setState({roundSeconds: event.target.value})
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
			<div class="settings-container">
			<h2 class="settingsTitle">Wybierz Kolor pionków</h2>
			<div class="color" style={{background: '#e400f6',flexDirection:'row', justifyContent:'flex-end', marginLeft:'-420px', height:'60px', width:'60px'}}></div>
			<div class="settingsColor" style={{justifyContent:'flex-end',marginLeft:'-150px', marginTop:'-60px'}}>Wolne</div><br></br>
			<div class="color" style={{background: '#ffc865',flexDirection:'row', justifyContent:'flex-end', marginLeft:'-420px', height:'60px', width:'60px'}}></div>
			<div class="settingsColor" style={{justifyContent:'flex-end',marginLeft:'-150px', marginTop:'-60px'}}>Wolne</div><br></br>
			<div class="color" style={{background: '#00ee32',flexDirection:'row', justifyContent:'flex-end', marginLeft:'-420px', height:'60px', width:'60px'}}></div>
			<div class="settingsColor" style={{justifyContent:'flex-end',marginLeft:'-150px', marginTop:'-60px'}}>Wolne</div><br></br>
			<div class="color" style={{background: '#00e1ea',flexDirection:'row', justifyContent:'flex-end', marginLeft:'-420px', height:'60px', width:'60px'}}></div>
			<div class="settingsColor" style={{justifyContent:'flex-end',marginLeft:'-150px', marginTop:'-60px'}}>Wolne</div><br></br>
			{this.state.correctData ? <button onClick={this.props.continueFunc}>kontynuuj</button>: <div><p className="error settingsTile">Uzupełnij prawidłowo formularz</p> <button disabled>Kontunuuj</button></div>}
			</div>
			)
	}

}
export default Pawn
