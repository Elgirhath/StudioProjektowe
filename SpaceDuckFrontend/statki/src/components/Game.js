import React from "react";
import Player from "./Player";
//import GameBoard from "./GameBoard";

class Game extends React.Component {
  constructor() {
    super();
    this.player = new Player();
    this.computer = new Player();
    this.state = {
      value: 0, 
      name: "Player1", 
      playerBoards: this.player.updateBoard(),
      compBoards: this.computer.updateBoard(), 
      turn: true, 
      startGame: false, 
      visible: false, 
      numberP: 0, 
      numberC: 0,
      button: true, 
      winner: false,
      shipsImg: [4, 3, 2, 1],
    };
    this.shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]; 
    this.numberShip = 0; 
  }

 

  onCh = () => {
    if (this.state.value === 0) {
      this.setState({ value: 1, button: true });
    } else {
      this.setState({ value: 0 });
    }
  };

  boardPlayer = () => {
    this.player.visible(true);
    this.player.random();
    this.player.createField();
    this.setState({ playerBoards: this.player.updateBoard(), button: false });
  };

  boardComputet = () => {
    this.computer.visible(false);
    this.computer.random();
    this.computer.createField();
    this.setState({ compBoards: this.computer.updateBoard(), button: false });

  };

  updateBoard = () => {
    this.setState({
      playerBoards: this.player.updateBoard(),
      compBoards: this.computer.updateBoard(),
    });
  };

  shotComputer = () => {
    const pos = this.player.possibility();
    if (!this.state.turn && pos === 0) {
      this.setState({
        playerBoards: this.player.updateBoard(),
        turn: !this.state.turn,
        numberC: this.state.numberC + 1,
      });
    } else {
      if (!this.state.turn && pos === 1) {
        this.setState({
          playerBoards: this.player.updateBoard(),
          numberC: this.state.numberC + 1,
        });
      }
    }
    this.checkWinner();
  };

  

  shotPlayer = () => {
    const pos = this.computer.possibility();
    if (this.state.turn && pos === 0) {
      this.setState({
        compBoards: this.computer.updateBoard(),
        turn: !this.state.turn,
        numberP: this.state.numberP + 1,
      });
    } else {
      if (this.state.turn && pos === 1) {
        this.setState({
          compBoards: this.computer.updateBoard(),
          numberP: this.state.numberP + 1,
        });
      }
    }
    this.checkWinner();
  };

  start = () => {
    const turn = Math.random() >= 0.5;
    this.setState({ startGame: true, turn: turn });
    this.boardComputet();
    //this.boardPlayer();
    this.updateBoard();
  }; 

  reStart = () => {
    this.setState({ startGame: false });
    this.clearAll();
    this.player.restartGame([4, 3, 3, 2, 2, 2, 1, 1, 1, 1]);
    this.computer.restartGame([4, 3, 3, 2, 2, 2, 1, 1, 1, 1]);
  };

  addShip = () => {
    if (this.state.value === 0 && this.numberShip < this.shipSizes.length) {
      if (this.player.getXY(this.shipSizes[this.numberShip])) {
        this.numberShip = this.numberShip + 1;
      }
      this.setState({ playerBoards: this.player.updateBoard() });
      if (this.numberShip === 10) {
        this.setState({ button: false });
      }
      console.log(this.numberShip);
    }
  };

  clear = () => {
    this.player.clear();
    if (this.numberShip > 0) {
      this.numberShip = this.numberShip - 1;
    }
    this.setState({ playerBoards: this.player.updateBoard() });
  }; 

  clearAll = () => {
    this.player.clearAll();
    this.numberShip = 0;
    this.setState({ playerBoards: this.player.updateBoard(), button: true });
  }; 

  checkWinner = () => {
    if (
      this.player.getDestruction().length === 0 ||
      this.computer.getDestruction().length === 0
    ) {
      this.setState({ winner: true });
    }
  };
  render() {
  
    const imgShips = this.state.shipsImg.map((element) => {
      return (
        <div className="shipImg" key={element}>
          <p>
            {
              this.player.getDestruction().filter((size) => size === element)
                .length
            }{" "}
            :
          </p>
          <img
            src={"/img/" + element + "desk.png"}
            alt={"fire"}
            width={80 + 18 * element}
            height={80}
          />
          <p>
            :{" "}
            {
              this.computer.getDestruction().filter((size) => size === element)
                .length
            }
          </p>
        </div>
      );
    });



    return (
      <div>
          <div className="GameBoard">
            {!this.state.startGame ? (
              <div>
                <h3 className={this.state.turn ? "name green" : "name"}>
                  {this.state.name}
                </h3>
                <div className="menu">
                  <div className="menuB">
                    <div>
                      {this.state.value === 0 ? (
                        <div>
                          <button className="btn" onClick={this.clear}>
                            Back
                          </button>
                          <button className="btn" onClick={this.clearAll}>
                            Clear All
                          </button>
                        </div>
                      ) : (
                        <button className="btn" onClick={this.boardPlayer}>
                          Rand
                        </button>
                      )}
                    </div>
                    <div>
                      <button
                        onClick={this.start}
                        disabled={this.state.button}
                        className="btn"
                      >
                        Start game
                      </button>
                    </div>
                  </div>
                </div>
                <div onClick={this.addShip}>{this.state.playerBoards}</div>
              </div>
            ) : (
              <div className="GameBoard">
                <div>
                  <h1 className={this.state.turn ? "name green" : "name"}>
                    {this.state.name}
                  </h1>
                  <div onClick={this.shotComputer}>
                    {this.state.playerBoards}
                  </div>
                </div>
                <div className="info">
                  {this.state.winner ? (
                    <h2>
                      {this.state.turn
                        ? "Player1: "
                        : "Player2"}
                    </h2>
                  ) : null}
                  {imgShips}
                  <button onClick={this.reStart} className="btn">
                    {this.state.winner ? "Play again" : "Restart"}
                  </button>
                </div>
                <div>
                  <h1 className={!this.state.turn ? "name green" : "name"}>
                    Player2
                  </h1>
                  <div onClick={this.shotPlayer}>{this.state.compBoards}</div>
                </div>
              </div>
            )}
          </div>
      </div>
    );
  }
}

export default Game;
