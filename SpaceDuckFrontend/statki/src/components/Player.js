import React from "react";
import GameBoard from "./GameBoard";

class Player extends React.Component {
  constructor() {
    super();
    this.ships = [];
    this.destructionShips = [];
    this.board = new GameBoard();
    this.bool = false;
  }

  restartGame = (arr) => {
    this.board.restartGame(arr);
  };

  getDestruction = () => {
    this.destructionShips = this.board.getDestruction();
    return this.destructionShips;
  };

  getXY = (size) => {
    const x = this.board.getX();
    const y = this.board.getY();
    let direction = 0;
    let flag = false;
    let size1 = size;

    if (this.ships.length > 0) {
      this.ships.forEach((element) => {
        if (element.x === x && element.y === y) {
          direction = element.direction;
          size1 = element.size;
          if (direction === 0) {
            direction = 1;
          } else {
            direction = 0;
          }

          this.ships.splice(this.ships.indexOf(element), 1);
          const ship = {
            x: x,
            y: y,
            direction: direction,
            size: parseInt(size1),
          };
          if (!this.checkShip(ship)) {
            direction = 0;
          }
          flag = true;
        }
      });

      const ship = {
        x: x,
        y: y,
        direction: direction,
        size: parseInt(size1),
      };
      if (this.checkShip(ship)) {
        this.addShips(ship);
        this.createField();
        if (!flag) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      const ship = {
        x: x,
        y: y,
        direction: direction,
        size: parseInt(size),
      };
      if (this.checkShip(ship)) {
        this.addShips(ship);
        this.createField();
        return true;
      }
    }
  }; 

  clear = () => {
    this.ships.pop();
    this.createField();
  }; 

  clearAll = () => {
    this.ships = [];
    this.createField();
  };

  possibility = (x, y) => {
    const pos = this.board.possibility(x, y);
    //this.board.checkDestruction(this.ships)
    return pos;
  };

  addShips = (...ships) => {
    console.log();
    for (const ship of ships) {
      if (!this.ships.includes(ship)) {
        this.ships.push(ship);
      }
    }
  }; 

  checkShip = (ship) => {
    if (ship.direction === 0) {
      if (ship.x + ship.size > 10) {
        return false;
      }
    }

    if (ship.direction === 1) {
      if (ship.y + ship.size > 10) {
        return false;
      }
    }

    const map = [
      [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],
    ];

    for (const ship of this.ships) {
      if (ship.direction === 0) {
        for (let x = ship.x - 1; x < ship.x + ship.size + 1; x++) {
          for (let y = ship.y - 1; y < ship.y + 2; y++) {
            if (map[y] && map[y][x]) {
              map[y][x] = false;
            }
          }
        }
      } else {
        for (let x = ship.x - 1; x < ship.x + 2; x++) {
          for (let y = ship.y - 1; y < ship.y + ship.size + 1; y++) {
            if (map[y] && map[y][x]) {
              map[y][x] = false;
            }
          }
        }
      }
    }

    if (ship.direction === 0) {
      for (let i = 0; i < ship.size; i++) {
        if (!map[ship.y][ship.x + i]) {
          return false;
        }
      }
    }

    if (ship.direction === 1) {
      for (let i = 0; i < ship.size; i++) {
        if (!map[ship.y + i][ship.x]) {
          return false;
        }
      }
    }

    return true;
  }; 

  createField = () => {
    this.board.createField(this.ships);
  }; 

  visible = (visible) => {
    this.board.visibles(visible);
    //console.log(visible)
  }; 

  updateBoard = () => this.board.drawBoard(); 

  random = () => {
    this.ships = [];

    for (let i = 4; i > 0; i--) {
      for (let j = 0; j < 5 - i; j++) {
        let flag = false;

        while (!flag) {
          const ship = {
            x: Math.floor(Math.random() * 10),
            y: Math.floor(Math.random() * 10),
            direction: Math.floor(Math.random() * 2),
            size: i,
          };

          if (this.checkShip(ship)) {
            this.addShips(ship);
            flag = true;
          }
        }
      }
    }
  }; 

  render() {
    return;
  }
}

export default Player;
