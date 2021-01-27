import React from 'react';
import './settings-style.css';
import PropTypes from 'prop-types';
class KeyInfo extends React.Component{
	static propTypes = {
  	keyValue: PropTypes.string,
    closeInfo:PropTypes.func.isRequired
   
  };
  static defaultProps = {
  	keyValue: "XXXXXXXXXXX",
   	closeInfo: () =>{}
  };
	constructor(...props){
		super(...props);
	}
	render(){
		const {
			keyValue,
			closeInfo,
    	} = this.props;
		return(
				<div className="settings-container">
				<h2 className="settingsTitle">Klucz do stołu</h2>
				<h3>{this.props.keyValue}</h3>
				<h3>Udostępnij znajomym</h3>
				<button onClick={this.props.closeInfo}>kontynuuj</button>
			</div>
			)
	}
}
export default KeyInfo