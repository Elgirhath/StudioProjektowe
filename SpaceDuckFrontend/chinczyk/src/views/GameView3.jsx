import React from 'react';
import Header from '../components/Header.jsx'
import GameScreen from '../components/GameScreen.jsx'
import './game-styles.css'
import GameView2 from "./GameView2";
import GameSettings from '../components/GameSettings.jsx';

class Game extends React.Component {
  constructor() {
    super();

  }

  render() {
    return (
      <div className="app">
        <Header/>
        <div className="kalambury-header"><h1>Chińczyk <span>#512</span></h1></div>
        <GameSettings/>
        {/*<GameScreen />*/}
      </div>
    )
  }

}

export default Game;
