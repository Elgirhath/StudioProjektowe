import React from 'react'
import './popup-style.css';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import address from '../configuration.json';
import classNames from "classnames";

const cookies = new Cookies();
class EndGamePopup extends React.Component{
	constructor(){
		super();
	}

	getRanking(){
		this.props.players.sort((plrA, plrB)=>{
			if(plrA.points < plrB.points) return 1;
			if(plrA.points > plrB.points) return -1;
			return 0;
		});
		return this.props.players;
	}

	
	render(){
		return(
			<div className="popup-container">
				<h2 className="popup-title">Koniec</h2>
				<div>
					<ul>
						{this.getRanking().map((arg,index) => 
							<li key={arg.id} >
								<ul className="user-record">
									<li>{index + 1}</li>
									<li>{arg.name}</li>
									<li>{arg.points}</li>
								</ul>
							</li>
						)}
					</ul>
				</div>
				<div>
					<button onClick={() => {this.props.handleEndGame();}}>zakończ</button>
					<button onClick={() => {this.props.handleContinue();}}>zagraj raz jeszcze</button>
				</div>
			</div>
			)
	}
	
}
export default EndGamePopup