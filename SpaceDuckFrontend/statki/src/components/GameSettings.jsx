import React from 'react'
import './settings-style.css';
import PropTypes from 'prop-types';
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
	setColor = (str) => {
		this.setState({color:str});
	}

	Colors(){
		return(
			<div className="colors-panel" style={{flexDirection:'row', marginTop:'-45px', justifyContent:'flex-end', marginRight:'-120px'}}> 
				<div className="color" style ={{background: "#e400f6",width: '40px', height: '40px'}} ></div>
				<div className="color" style={{background: '#00e1ea',width: '40px', height: '40px'}}></div>
			 </div>)
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
				<h2 className="settingsTitle">Ustawienia</h2>
				<div className="settingsTile vertical">
				<label className="type"><span className={this.props.privateTable ? "settingsRadio" : "settingsRadio selected"}onClick={this.props.handlePublicTable}></span><input type="radio" name="tableType"  />publiczny</label>
				<label className="type"><span className={!this.props.privateTable ? "settingsRadio" : "settingsRadio selected"} onClick={this.props.handlePrivateTable}></span><input type="radio" name="tableType" />prywatny</label>
				</div>
				<div className="settingsTile">
				
				<div>
				<p>czas na ruch <span><input type="number" className="timeInput"/> : <input type="number"className="timeInput" /></span></p>
				<p>kolor pionka <span><span onClick={()=>{this.setColor("white")}} className={this.isWhiteSelected() ? "color-selector white selected" : "color-selector white"}></span> <span onClick={()=>{this.setColor("black")}} className={this.isWhiteSelected() ? "color-selector black" : "color-selector black selected"}></span></span></p>
				</div>
				</div>
				<button onClick={this.props.continueFunc}>kontynuuj</button>
			</div>
			)
	}
	
}
export default GameSettings