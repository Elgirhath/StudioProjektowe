import React from "react";

class GameBoard extends React.Component {
  constructor() {
    super();
    this.state = {
      board: [
        Array(10).fill(0),
        Array(10).fill(0),
        Array(10).fill(0),
        Array(10).fill(0),
        Array(10).fill(0),
        Array(10).fill(0),
        Array(10).fill(0),
        Array(10).fill(0),
        Array(10).fill(0),
        Array(10).fill(0),
      ], 
    };
    this.visible = true;
    this.x = 0;
    this.y = 0;
    this.surviving = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
  }

  restartGame = (arr) => {
    this.surviving = arr;
  };

  getX = () => {
    return this.x;
  };

  getY = () => {
    return this.y;
  };

  zeroBoard = () => {
    let boards = this.state.board;
    for (let i = 0; i < 10; i++) {
      boards.splice(i, 1, Array(10).fill(0));
    }
    //this.setState({board: boards})
  }; 

  createField = (arr) => {
    this.zeroBoard();

    let board = this.state.board;
    arr.forEach((element, id) => {
      for (let size = 0; size < arr[id].size; size++) {
        if (element.direction === 0) {
          board[element.y][element.x + size] = 1;
        } else {
          board[element.y + size][element.x] = 1;
        }
      }
    });
  }; 

  possibility = (prx, pry) => {
    if (prx !== undefined) {
      this.x = prx;
    }

    if (pry !== undefined) {
      this.y = pry;
    }
    return this.shot(this.x, this.y);
  }; 

  shot = (x, y) => {
    if (this.state.board[y][x] < 2) {
      let board = this.state.board;
      if (board[y][x] === 0) {
        board[y][x] = 2;
        return 0;
      } else {
        board[y][x] = 3;
        this.checkDestruction();
        return 1;
      }
    } else {
      return 2;
    }
  }; 

  checkDestruction = () => {
    let size = 1;
    let right = 0;
    let left = 0;
    let up = 0;
    let down = 0;

    for (let i = 1; i < this.y + 1; i++) {
      if (
        this.state.board[this.y - i][this.x] === 0 ||
        this.state.board[this.y - i][this.x] === 2
      ) {
        break;
      }
      if (this.state.board[this.y - i][this.x] === 3) {
        up += 1;
        size += 1;
      }
      if (this.state.board[this.y - i][this.x] === 1) {
        size += 1;
      }
    } 

    for (let i = 1; i < 10 - this.y; i++) {
      if (
        this.state.board[this.y + i][this.x] === 0 ||
        this.state.board[this.y + i][this.x] === 2
      ) {
        break;
      }
      if (this.state.board[this.y + i][this.x] === 3) {
        down += 1;
        size += 1;
      }
      if (this.state.board[this.y + i][this.x] === 1) {
        size += 1;
      }
    } 
    for (let i = 1; i < this.x + 1; i++) {
      if (
        this.state.board[this.y][this.x - i] === 0 ||
        this.state.board[this.y][this.x - i] === 2
      ) {
        break;
      }
      if (this.state.board[this.y][this.x - i] === 3) {
        left += 1;
        size += 1;
      }
      if (this.state.board[this.y][this.x - i] === 1) {
        size += 1;
      }
    } 

    for (let i = 1; i < 10 - this.x; i++) {
      if (
        this.state.board[this.y][this.x + i] === 0 ||
        this.state.board[this.y][this.x + i] === 2
      ) {
        break;
      }
      if (this.state.board[this.y][this.x + i] === 3) {
        right += 1;
        size += 1;
      }
      if (this.state.board[this.y][this.x + i] === 1) {
        size += 1;
      }
    } 

    const sumX = left + right;
    const sumY = up + down;
    let board = this.state.board;

    if (size === sumY + sumX + 1) {
      if (sumX > 0) {
        for (let y = this.y - 1; y < this.y + 2; y++) {
          for (let x = this.x - left - 1; x < size + this.x - left + 1; x++) {
            if (board[y] && board[x]) {
              if (board[y][x] === 0) {
                board[y][x] = 5;
              }
              if (board[y][x] === 3) {
                board[y][x] = 4;
              }
            }
          }
        }
      } else {
        for (let x = this.x - 1; x < this.x + 2; x++) {
          for (let y = this.y - up - 1; y < size + 1 + this.y - up; y++) {
            if (board[y] && board[x]) {
              if (board[y][x] === 0) {
                board[y][x] = 5;
              }
              if (board[y][x] === 3) {
                board[y][x] = 4;
              }
            }
          }
        }
      }
      this.surviving.splice(this.surviving.indexOf(size), 1);
    } 
  }; 

  getDestruction = () => {
    return this.surviving;
  };

  action = (x, y) => {
    this.x = x;
    this.y = y;
  }; 

  visibles = (visible) => (this.visible = visible);

  drawBoard = () => {
    const axisY = this.state.board.map((element, indexY) => {
      const axisX = element.map((element, indexX) => {
        switch (element) {
          case 0:
            return (
              <div
                className="box water"
                key={indexX + indexY * 10}
                onClick={() => {
                  this.action(indexX, indexY);
                }}
              >
                {/* {element} */}
              </div>
            );

          case 2:
            return (
              <div className="box water" key={indexX + indexY * 10}>
                <div className="miss">{/* {element} */}</div>
              </div>
            );

          case 1:
            if (this.visible) {
              return (
                <div
                  className="box ship"
                  key={indexX + indexY * 10}
                  onClick={() => {
                    this.action(indexX, indexY);
                  }}
                >
                  {/* {element} */}
                </div>
              );
            } else {
              return (
                <div
                  className="box water"
                  key={indexX + indexY * 10}
                  onClick={() => {
                    this.action(indexX, indexY);
                  }}
                >
                  {/* {element} */}
                </div>
              );
            }

          case 3:
            if (this.visible) {
              return (
                <div className="box ship hurtb" key={indexX + indexY * 10}>
                  <img src={"/img/fire-icon.png"} alt={"fire"} />
                </div>
              );
            } else {
              return (
                <div className="box water hurtb" key={indexX + indexY * 10}>
                  <img src={"/img/fire-icon.png"} alt={"fire"} />
                </div>
              );
            }

          case 4:
            return (
              <div className="box die" key={indexX + indexY * 10}>
                <img src={"/img/fire-icon.png"} alt={"fire"} />
              </div>
            );

          case 5:
            return (
              <div className="box water" key={indexX + indexY * 10}>
                <div className="miss1">{/* {element} */}</div>
              </div>
            );
        }
      });
      return axisX;
    });
    return <div className="board">{axisY}</div>;
  }; 

  render() {
    return;
  }
}

export default GameBoard;
