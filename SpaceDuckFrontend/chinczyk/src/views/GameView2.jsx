import React, { useEffect, useState } from "react";
import './game-styles.css'

let currPos = 0;
const step = 45.0;
let currcolor = '';
let NumOfPaw = '';
let num = 0;
let topOffset = 0;
let leftOffset = 0;
let clicked = false;
let currpawn = '';
const allcolor = ['red', 'blue', 'green', 'yellow'];
const pawnOut = { red: 0, blue: 0, green: 0, yellow: 0 };

let positions = {
  redpawn1: 0, redpawn2: 0, redpawn3: 0, redpawn4: 0,
  bluepawn1: 0, bluepawn2: 0, bluepawn3: 0, bluepawn4: 0,
  greenpawn1: 0, greenpawn2: 0, greenpawn3: 0, greenpawn4: 0,
  yellowpawn1: 0, yellowpawn2: 0, yellowpawn3: 0, yellowpawn4: 0

};

let onboard = {
  redpawn1: 0, redpawn2: 0, redpawn3: 0, redpawn4: 0,
  bluepawn1: 0, bluepawn2: 0, bluepawn3: 0, bluepawn4: 0,
  greenpawn1: 0, greenpawn2: 0, greenpawn3: 0, greenpawn4: 0,
  yellowpawn1: 0, yellowpawn2: 0, yellowpawn3: 0, yellowpawn4: 0
};

const defaultPawnPosition = {
  redpawn1: { top: '188px', left: '526px' },
  redpawn2: { top: '145px', left: '526px' },
  redpawn3: { top: '144px', left: '569px' },
  redpawn4: { top: '188px', left: '569px' },

  yellowpawn1: { top: '600px', left: '116px' },
  yellowpawn2: { top: '559px', left: '158px' },
  yellowpawn3: { top: '600px', left: '158px' },
  yellowpawn4: { top: '559px', left: '116px' },

  greenpawn1: { top: '188px', left: '115px' },
  greenpawn2: { top: '147px', left: '158px' },
  greenpawn3: { top: '147px', left: '115px' },
  greenpawn4: { top: '188px', left: '158px' },

  bluepawn1: { top: '554px', left: '568px' },
  bluepawn2: { top: '554px', left: '525px' },
  bluepawn3: { top: '600px', left: '568px' },
  bluepawn4: { top: '600px', left: '525px' },

};


// do wyrzucenia:
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// do wyrzucenia


export default function({gameStatus, onGameStatusChange}) {
  const [pawnPosition, setPawnPosition] = useState(defaultPawnPosition);

  useEffect(() => {

    // jak pozenisz BE
    // this.state.hubConnection.on('GameStatus', (status) => {
    //   if (status) {
    //     getStateAndUpdate(status);
    //   }
    // });

    // zamiast tego:
    const state = getCookie('statusGame');
    if (state) {
      getStateAndUpdate(state);
    }
    // zamiast tego

  }, []);


  // useEffect(() => {
  //   if (gameStatus) {
  //     getStateAndUpdate(gameStatus);
  //   }
  // }, [gameStatus]);

  useEffect(() => {
    saveStateAndSendData();
  }, [pawnPosition]);

  function haveHover() {
    let count = 0;
    let toKill = '';
    for (let i = 0; i < allcolor.length; i++) {
      for (let n = 1; n <= 4; n++) {
        const firstPawn = document.getElementById(`${allcolor[i]}pawn${n}`);
        const secondPawn = document.getElementById(currpawn);
        if (firstPawn.style.top == secondPawn.style.top && firstPawn.style.left == secondPawn.style.left && currcolor != allcolor[i] && currPos + num < 44) {
          count++;
          toKill = `${allcolor[i]}pawn${n}`;
          return toKill;
        }
      }
    }
    return false;
  }

  function stuck() {
    if (onboard[currpawn] == 0 || currPos + num > 44) {
      if (dontHaveOtherFree() || currPos + num > 44) {
        const badtext = document.getElementById('badtext');
        badtext.innerText = 'Unfortunatlly you stuck';
        clicked = false;
        const dice = document.getElementById('dice');
        dice.style.backgroundImage = 'url(images/dice/dice.png)';
        setTimeout(changePlayer, 1000);
      }
    }
  }

  function changePlayer() {
    if (num != 6) {
      const text = document.getElementById('player');
      switch (text.innerText) {
        case 'red':
          text.innerText = text.style.color = 'blue';
          break;
        case 'blue':
          text.innerText = text.style.color = 'yellow';
          break;
        case 'yellow':
          text.innerText = text.style.color = 'green';
          break;
        case 'green':
          text.innerText = text.style.color = 'red';
          break;
      }
    }
    const badtext = document.getElementById('badtext');
    badtext.innerText = '';
    const dice = document.getElementById('dice');
    dice.style.backgroundImage = 'url(/images/dice/dice.png)';
  }


  function dontHaveOtherFree() {
    const text = document.getElementById('player');
    for (let i = 1; i <= 4; i++) {
      if (onboard[`${text.innerText}pawn${i}`] == 1 || positions[`${text.innerText}pawn${i}`] + num >= 44) {
        return false;
      }
    }
    return true;
  }

  function checkForWinner() {
    if (pawnOut[currcolor] == 4) {
      const dice = document.getElementById('dice');
      const player = document.getElementById('player');
      const textContainer1 = document.getElementById('textContainer1');
      const textContainer2 = document.getElementById('textContainer2');
      dice.innerText = '';
      dice.style.visibility = 'hidden';
      textContainer1.innerText = '';
      textContainer2.innerText = '';
      player.innerText = `The Winner is the ${currcolor} player`;
    }
  }

  function getStateAndUpdate(state) {
    const parseState = JSON.parse(state);
    const text = document.getElementById('player');
    text.innerText = parseState.currcolor;
    positions = parseState.positions;
    onboard = parseState.onboard;
    setPawnPosition(parseState.pawnPosition);
    currcolor = parseState.currcolor;
  }

  function saveStateAndSendData() {
    const state = {
      positions,
      onboard,
      pawnPosition,
      currcolor
    };


    const stateStr = JSON.stringify(state);

    // jak pozenisz BE
    // hubConnection.invoke('SendGameStatus', this.state.table.id+'', stateStr);
    // zamiast tego:
    setCookie('statusGame', stateStr, 1);

    // onGameStatusChange(stateStr);

  }

  function stepDown() {
    topOffset += +step;
    currPos++;
  }

  function stepUp() {
    topOffset -= step;
    currPos++;
  }

  function stepLeft() {
    leftOffset -= step;
    currPos++;
  }

  function stepRight() {
    leftOffset += step;
    currPos++;
  }

  const stepsRed = [];
  const stepsYellow = [];
  const stepsBlue = [];
  const stepsGreen = [];

  function pushSteps(value, steps, count) {
    for (let i = 0; i < count; i++) {
      steps.push(value);
    }
  }

// Red pawns path
  pushSteps(stepDown, stepsRed, 4);
  pushSteps(stepRight, stepsRed, 4);
  pushSteps(stepDown, stepsRed, 2);
  pushSteps(stepLeft, stepsRed, 4);
  pushSteps(stepDown, stepsRed, 4);
  pushSteps(stepLeft, stepsRed, 2);
  pushSteps(stepUp, stepsRed, 4);
  pushSteps(stepLeft, stepsRed, 4);
  pushSteps(stepUp, stepsRed, 2);
  pushSteps(stepRight, stepsRed, 4);
  pushSteps(stepUp, stepsRed, 4);
  pushSteps(stepRight, stepsRed, 1);
  pushSteps(stepDown, stepsRed, 5);
// Yellow pawns path

  pushSteps(stepUp, stepsYellow, 4);
  pushSteps(stepLeft, stepsYellow, 4);
  pushSteps(stepUp, stepsYellow, 2);
  pushSteps(stepRight, stepsYellow, 4);
  pushSteps(stepUp, stepsYellow, 4);
  pushSteps(stepRight, stepsYellow, 2);
  pushSteps(stepDown, stepsYellow, 4);
  pushSteps(stepRight, stepsYellow, 4);
  pushSteps(stepDown, stepsYellow, 2);
  pushSteps(stepLeft, stepsYellow, 4);
  pushSteps(stepDown, stepsYellow, 4);
  pushSteps(stepLeft, stepsYellow, 1);
  pushSteps(stepUp, stepsYellow, 5);

// Blue pawns path
  pushSteps(stepLeft, stepsBlue, 4);
  pushSteps(stepDown, stepsBlue, 4);
  pushSteps(stepLeft, stepsBlue, 2);
  pushSteps(stepUp, stepsBlue, 4, 2);
  pushSteps(stepLeft, stepsBlue, 4);
  pushSteps(stepUp, stepsBlue, 2);
  pushSteps(stepRight, stepsBlue, 4);
  pushSteps(stepUp, stepsBlue, 4);
  pushSteps(stepRight, stepsBlue, 2);
  pushSteps(stepDown, stepsBlue, 4);
  pushSteps(stepRight, stepsBlue, 4);
  pushSteps(stepDown, stepsBlue, 1);
  pushSteps(stepLeft, stepsBlue, 5);

// Green pawns path
  pushSteps(stepRight, stepsGreen, 4);
  pushSteps(stepUp, stepsGreen, 4);
  pushSteps(stepRight, stepsGreen, 2);
  pushSteps(stepDown, stepsGreen, 4);
  pushSteps(stepRight, stepsGreen, 4);
  pushSteps(stepDown, stepsGreen, 2);
  pushSteps(stepLeft, stepsGreen, 4);
  pushSteps(stepDown, stepsGreen, 4);
  pushSteps(stepLeft, stepsGreen, 2);
  pushSteps(stepUp, stepsGreen, 4);
  pushSteps(stepLeft, stepsGreen, 4);
  pushSteps(stepUp, stepsGreen, 1);
  pushSteps(stepRight, stepsGreen, 5);

  function resetPawn(victim) {
    onboard[victim] = 0;
    positions[victim] = 0;

    setPawnPosition({
      ...pawnPosition,
      [victim]: {
        ...defaultPawnPosition[victim]
      }
    });
  }

  function randomNum() {
    let count = 0;
    let toKill = '';
    for (let i = 0; i < allcolor.length; i++) {
      for (let n = 1; n <= 4; n++) {
        const firstPawn = document.getElementById(`${allcolor[i]}pawn${n}`);
        const secondPawn = document.getElementById(currpawn);
        console.log(firstPawn)
        if ((firstPawn.style.top + 15 > secondPawn.style.top || firstPawn.style.top - 15 < secondPawn.style.top)  && (firstPawn.style.left +15 > secondPawn.style.left || firstPawn.style.left -15 < secondPawn.style.left) && currcolor != allcolor[i] && currPos + num < 44) {
          count++;
          toKill = `${allcolor[i]}pawn${n}`;
          return toKill;
        }
      }
    }
    if (!clicked) {
      num = Math.floor((Math.random() * 6) + 1);
      // num = 6;
      const dice = document.getElementById('dice');
      dice.style.backgroundImage = `url(/images/dice/${num}.png)`;
      clicked = true;
    }
    if (num != 6 && dontHaveOtherFree()) {
      const bad = document.getElementById('badtext');
      bad.innerText = 'Unfortunatlly you stuck';
      window.setTimeout(changePlayer, 1000);
      clicked = false;
    }
  }

  function randomMove(Color, paw) {
    const text = document.getElementById('player');
    NumOfPaw = paw;
    currcolor = Color;
    currpawn = `${currcolor}pawn${NumOfPaw}`;
    currPos = positions[currpawn];
    leftOffset = 0;
    topOffset = 0;
    if (num + currPos > 44) {
      stuck();
    } else if (clicked) {
      const position = currPos;
      if (text.innerText == currcolor) {
        if (onboard[currpawn] === 1 || num === 6) {
          if (onboard[currpawn] === 0) {
            onboard[currpawn] = 1;
            switch (Color) {
              case 'red':
                setPawnPosition({
                  ...pawnPosition,
                  [currpawn]: {
                    left: `${351}px`,
                    top: `${134}px`
                  }
                });
                break;

              case 'yellow':
                setPawnPosition({
                  ...pawnPosition,
                  [currpawn]: {
                    left: `${264}px`,
                    top: `${561}px`
                  }
                });
                break;

              case 'blue':
                setPawnPosition({
                  ...pawnPosition,
                  [currpawn]: {
                    left: `${519}px`,
                    top: `${393}px`
                  }
                });
                break;

              case 'green':
                setPawnPosition({
                  ...pawnPosition,
                  [currpawn]: {
                    left: `${96}px`,
                    top: `${305}px`
                  }
                });
                break;
            }
          } else {
            switch (Color) {
              case 'red':
                for (let i = currPos; i < position + num; i++) {
                  stepsRed[i]();
                }
                break;

              case 'yellow':
                for (let i = currPos; i < position + num; i++) {
                  stepsYellow[i]();
                }
                break;

              case 'blue':
                for (let i = currPos; i < position + num; i++) {
                  stepsBlue[i]();
                }
                break;

              case 'green':
                for (let i = currPos; i < position + num; i++) {
                  stepsGreen[i]();
                }
                break;
            }

            const currTop = Number(pawnPosition[currpawn].top.replace(/[a-z]/g, ''));
            const currLeft = Number(pawnPosition[currpawn].left.replace(/[a-z]/g, ''));
            setPawnPosition({
              ...pawnPosition,
              [currpawn]: {
                left: `${currLeft + leftOffset}px`,
                top: `${currTop + topOffset}px`
              }
            });

            positions[currpawn] = currPos;
            const victim = haveHover();
            if (victim != false) {
              resetPawn(victim);
            }
            if (currPos == 44) {
              pawnOut[currcolor]++;
              onboard[currpawn] = 0;
              positions[currpawn] = 0;
              document.getElementById(currpawn).style.visibility = 'hidden';
            }

            checkForWinner();
            changePlayer();
          }
          num = 0;
          clicked = false;
          const dice = document.getElementById('dice');
          dice.style.backgroundImage = 'url(/images/dice/dice.png)';
        } else {
          stuck();
        }
      }
    }
  }


  return (
    <div className="gameScreen">

      <div className="game-container">
        <div className="game-chat">
          <div className="messages">messages messages</div>
        </div>
        <div className="main-game">

          <div id="dice" onClick={() => randomNum()}
               style={{
                 backgroundImage: "url(/images/dice/dice.png)",
                 backgroundSize: 'contain',
                 width: '150px',
                 height: '150px',
                 float: 'left'
               }}>
          </div>

          <div className="pawns" id="redpawn1" onClick={() => randomMove('red', 1)}
               style={{ backgroundColor: '#e400f6', ...pawnPosition['redpawn1'] }}/>
          <div className="pawns" id="redpawn2" onClick={() => randomMove('red', 2)}
               style={{ backgroundColor: '#e400f6', ...pawnPosition['redpawn2'] }}/>
          <div className="pawns" id="redpawn3" onClick={() => randomMove('red', 3)}
               style={{ backgroundColor: '#e400f6', ...pawnPosition['redpawn3'] }}/>
          <div className="pawns" id="redpawn4" onClick={() => randomMove('red', 4)}
               style={{ backgroundColor: '#e400f6', ...pawnPosition['redpawn4'] }}/>

          <div className="pawns" id="yellowpawn1" onClick={() => randomMove('yellow', 1)}
               style={{ backgroundColor: '#ffc865', ...pawnPosition['yellowpawn1'] }}/>
          <div className="pawns" id="yellowpawn2" onClick={() => randomMove('yellow', 2)}
               style={{ backgroundColor: '#ffc865', ...pawnPosition['yellowpawn2'] }}/>
          <div className="pawns" id="yellowpawn3" onClick={() => randomMove('yellow', 3)}
               style={{ backgroundColor: '#ffc865', ...pawnPosition['yellowpawn3'] }}/>
          <div className="pawns" id="yellowpawn4" onClick={() => randomMove('yellow', 4)}
               style={{ backgroundColor: '#ffc865', ...pawnPosition['yellowpawn4'] }}/>

          <div className="pawns" id="greenpawn1" onClick={() => randomMove('green', 1)}
               style={{ backgroundColor: '#00ee32', ...pawnPosition['greenpawn1'] }}/>
          <div className="pawns" id="greenpawn2" onClick={() => randomMove('green', 2)}
               style={{ backgroundColor: '#00ee32', ...pawnPosition['greenpawn2'] }}/>
          <div className="pawns" id="greenpawn3" onClick={() => randomMove('green', 3)}
               style={{ backgroundColor: '#00ee32', ...pawnPosition['greenpawn3'] }}/>
          <div className="pawns" id="greenpawn4" onClick={() => randomMove('green', 4)}
               style={{ backgroundColor: '#00ee32', ...pawnPosition['greenpawn4'] }}/>

          <div className="pawns" id="bluepawn1" onClick={() => randomMove('blue', 1)}
               style={{ backgroundColor: '#00e1ea', ...pawnPosition['bluepawn1'] }}/>
          <div className="pawns" id="bluepawn2" onClick={() => randomMove('blue', 2)}
               style={{ backgroundColor: '#00e1ea', ...pawnPosition['bluepawn2'] }}/>
          <div className="pawns" id="bluepawn3" onClick={() => randomMove('blue', 3)}
               style={{ backgroundColor: '#00e1ea', ...pawnPosition['bluepawn3'] }}/>
          <div className="pawns" id="bluepawn4" onClick={() => randomMove('blue', 4)}
               style={{ backgroundColor: '#00e1ea', ...pawnPosition['bluepawn4'] }}/>

          <h3 id="player" style={{ float: 'left', color: 'red' }}>red</h3>
          <p id="badtext" style={{ float: 'left' }}></p>

        </div>
      </div>
    </div>
  )
};
