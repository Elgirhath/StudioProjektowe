import React from 'react';
import Header from '../components/Header.jsx'
import GamePawnChoose from '../components/GamePawnChoose.jsx'

import './game-styles.css'
class PawnChoose extends React.Component{
	constructor(){
		super();

	}

	render(){
		return(
			<div className="app">
           		 <Header/>
           		 <div className="kalambury-header"><h1>Chińczyk <span>#512</span></h1></div>
           		 <GamePawnChoose/>
           	</div>
			)
	}

}
export default PawnChoose;
