import React from "react";
import './game-styles.css'

let currPos = 0;
const step = 41.5+4;
let currcolor = '';
let NumOfPaw = '';
let num = 0;
let clicked = false;
let currpawn = '';
const allcolor = ['red', 'blue', 'green', 'yellow'];
const pawnOut = { red: 0, blue: 0, green: 0, yellow: 0 };

export default function() {

  function haveHover() {
    let count = 0;
    let toKill = '';
    for (let i = 0; i < allcolor.length; i++) {
      for (let n = 1; n <= 4; n++) {
        const firstPawn = document.getElementById(`${allcolor[i]}pawn${n}`);
        const secondPawn = document.getElementById(currpawn);
        if (((parseInt(firstPawn.style.top.replace(/px/,""))+10)+"px" >= secondPawn.style.top && (parseInt(firstPawn.style.top.replace(/px/,""))-10)+"px" <= secondPawn.style.top) && ((parseInt(firstPawn.style.left.replace(/px/,""))+10)+"px" >= secondPawn.style.left && (parseInt(firstPawn.style.left.replace(/px/,""))-10)+"px" <= secondPawn.style.left) && currcolor != allcolor[i] && currPos + num < 44) {
          count++;
          toKill = `${allcolor[i]}pawn${n}`;
          console.log(toKill)
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

  const positions = {
    redpawn1: 0, redpawn2: 0, redpawn3: 0, redpawn4: 0,
    bluepawn1: 0, bluepawn2: 0, bluepawn3: 0, bluepawn4: 0,
    greenpawn1: 0, greenpawn2: 0, greenpawn3: 0, greenpawn4: 0,
    yellowpawn1: 0, yellowpawn2: 0, yellowpawn3: 0, yellowpawn4: 0
  };
  var onboard = {
    redpawn1: 0, redpawn2: 0, redpawn3: 0, redpawn4: 0,
    bluepawn1: 0, bluepawn2: 0, bluepawn3: 0, bluepawn4: 0,
    greenpawn1: 0, greenpawn2: 0, greenpawn3: 0, greenpawn4: 0,
    yellowpawn1: 0, yellowpawn2: 0, yellowpawn3: 0, yellowpawn4: 0
  };

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

  function stepDown() {
    const doc = document.getElementById(`${currcolor}pawn${NumOfPaw}`);
    const curr = Number(doc.style.top.replace(/[a-z]/g, ''));
    doc.style.top = `${curr + step}px`;
    currPos++;
  }

  function stepUp() {
    const doc = document.getElementById(currpawn);
    const curr = Number(doc.style.top.replace(/[a-z]/g, ''));
    doc.style.top = `${curr - step}px`;
    currPos++;
  }

  function stepLeft() {
    const doc = document.getElementById(currpawn);
    const curr = Number(doc.style.left.replace(/[a-z]/g, ''));
    doc.style.left = `${curr - step}px`;
    currPos++;
  }

  function stepRight() {
    const doc = document.getElementById(currpawn);
    const curr = Number(doc.style.left.replace(/[a-z]/g, ''));
    doc.style.left = `${curr + step}px`;
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
    const pawnToMove = document.getElementById(victim);
    switch (victim) {
      case 'redpawn1':
        pawnToMove.style.top = `${188}px`;
        pawnToMove.style.left = `${526}px`;
        break;
      case 'redpawn2':
        pawnToMove.style.top = `${145}px`;
        pawnToMove.style.left = `${526}px`;
        break;
      case 'redpawn3':
        pawnToMove.style.top = `${144}px`;
        pawnToMove.style.left = `${569}px`;
        break;
      case 'redpawn4':
        pawnToMove.style.top = `${188}px`;
        pawnToMove.style.left = `${569}px`;
        break;
      case 'bluepawn1':
        pawnToMove.style.top = `${554}px`;
        pawnToMove.style.left = `${568}px`;
        break;
      case 'bluepawn2':
        pawnToMove.style.top = `${554}px`;
        pawnToMove.style.left = `${525}px`;
        break;
      case 'bluepawn3':
        pawnToMove.style.top = `${600}px`;
        pawnToMove.style.left = `${568}px`;
        break;
      case 'bluepawn4':
        pawnToMove.style.top = `${600}px`;
        pawnToMove.style.left = `${525}px`;
        break;
      case 'greenpawn1':
        pawnToMove.style.top = `${188}px`;
        pawnToMove.style.left = `${115}px`;
        break;
      case 'greenpawn2':
        pawnToMove.style.top = `${147}px`;
        pawnToMove.style.left = `${158}px`;
        break;
      case 'greenpawn3':
        pawnToMove.style.top = `${147}px`;
        pawnToMove.style.left = `${115}px`;
        break;
      case 'greenpawn4':
        pawnToMove.style.top = `${188}px`;
        pawnToMove.style.left = `${158}px`;
        break;
      case 'yellowpawn1':
        pawnToMove.style.top = `${600}px`;
        pawnToMove.style.left = `${116}px`;
        break;
      case 'yellowpawn2':
        pawnToMove.style.top = `${559}px`;
        pawnToMove.style.left = `${158}px`;
        break;
      case 'yellowpawn3':
        pawnToMove.style.top = `${600}px`;
        pawnToMove.style.left = `${158}px`;
        break;
      case 'yellowpawn4':
        pawnToMove.style.top = `${559}px`;
        pawnToMove.style.left = `${116}px`;
        break;

    }
  }

  function randomNum() {
    if (!clicked) {
      num = Math.floor((Math.random() * 6) + 1);
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
    console.log(currPos, positions);
    if (num + currPos > 44) {
      stuck();
    } else if (clicked) {
      const position = currPos;
      if (text.innerText == currcolor) {
        if (onboard[currpawn] === 1 || num === 6) {
          if (onboard[currpawn] === 0) {
            const doc = document.getElementById(currpawn);
            switch (Color) {
              case 'red':
                doc.style.left = `${391}px`;
                doc.style.top = `${139}px`;
                break;

              case 'yellow':
                doc.style.left = `${294}px`;
                doc.style.top = `${600}px`;
                break;

              case 'blue':
                doc.style.left = `${566}px`;
                doc.style.top = `${413}px`;
                break;

              case 'green':
                doc.style.left = `${116}px`;
                doc.style.top = `${328}px`;
                break;
            }
            onboard[currpawn] = 1;
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
       
        <div className="main-game1">

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
               style={{ backgroundColor: '#e400f6', top: '188px', left: '526px' }}/>
          <div className="pawns" id="redpawn2" onClick={() => randomMove('red', 2)}
               style={{ backgroundColor: '#e400f6', top: '145px', left: '526px' }}/>
          <div className="pawns" id="redpawn3" onClick={() => randomMove('red', 3)}
               style={{ backgroundColor: '#e400f6', top: '144px', left: '569px' }}/>
          <div className="pawns" id="redpawn4" onClick={() => randomMove('red', 4)}
               style={{ backgroundColor: '#e400f6', top: '188px', left: '569px' }}/>

          <div className="pawns" id="yellowpawn1" onClick={() => randomMove('yellow', 1)}
               style={{ backgroundColor: '#ffc865', top: '600px', left: '116px' }}/>
          <div className="pawns" id="yellowpawn2" onClick={() => randomMove('yellow', 2)}
               style={{ backgroundColor: '#ffc865', top: '559px', left: '158px' }}/>
          <div className="pawns" id="yellowpawn3" onClick={() => randomMove('yellow', 3)}
               style={{ backgroundColor: '#ffc865', top: '600px', left: '158px' }}/>
          <div className="pawns" id="yellowpawn4" onClick={() => randomMove('yellow', 4)}
               style={{ backgroundColor: '#ffc865', top: '559px', left: '116px' }}/>

          <div className="pawns" id="greenpawn1" onClick={() => randomMove('green', 1)}
               style={{ backgroundColor: '#00ee32', top: '188px', left: '115px' }}/>
          <div className="pawns" id="greenpawn2" onClick={() => randomMove('green', 2)}
               style={{ backgroundColor: '#00ee32', top: '147px', left: '158px' }}/>
          <div className="pawns" id="greenpawn3" onClick={() => randomMove('green', 3)}
               style={{ backgroundColor: '#00ee32', top: '147px', left: '115px' }}/>
          <div className="pawns" id="greenpawn4" onClick={() => randomMove('green', 4)}
               style={{ backgroundColor: '#00ee32', top: '188px', left: '158px' }}/>

          <div className="pawns" id="bluepawn1" onClick={() => randomMove('blue', 1)}
               style={{ backgroundColor: '#00e1ea', top: '554px', left: '568px' }}/>
          <div className="pawns" id="bluepawn2" onClick={() => randomMove('blue', 2)}
               style={{ backgroundColor: '#00e1ea', top: '554px', left: '525px' }}/>
          <div className="pawns" id="bluepawn3" onClick={() => randomMove('blue', 3)}
               style={{ backgroundColor: '#00e1ea', top: '600px', left: '568px' }}/>
          <div className="pawns" id="bluepawn4" onClick={() => randomMove('blue', 4)}
               style={{ backgroundColor: '#00e1ea', top: '600px', left: '525px' }}/>

          <h3 id="player" style={{ float: 'left', color: 'red' }}>red</h3>
          <p id="badtext" style={{ float: 'left' }}></p>

        </div>
      </div>
    </div>
  )
};
