import React from 'react';
import ReactPaint from './ReactPaint.jsx';
import '../views/game-styles.css'
import UserPanel from './UserPanel.jsx';
import dice1 from '../assets/6.png'
import GameSettings from './GameSettings.jsx';
import KeyInfo from './KeyInfo.jsx';
import PawnSingle from "./PawnSingle";
import GameView2 from "../components/GameView2.jsx";


class GameScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      color: '#ffffff',
      clear: false,
      width: window.innerWidth * 0.9 * 0.55 - 20,
      height: window.innerHeight * 0.6,
      message: '',
      settings: true,
      privateTable: false,
      keyView: false,
      key: 'XXXXXXXX',	//do pobrania

    }
    this.handleClear = this.handleClear.bind(this);
    this.handleChangeColor = this.handleChangeColor.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  handleChangeColor(str) {
    this.setState({ clear: false });
    this.setState({ color: str });
  }

  handleClear() {
    this.setState({ clear: true });
  }

  handleMessage(event) {
    this.setState({ message: event.target.value });
  }

  handleSendMessage(event) {
    if (event.keyCode == 13) {
      console.log("send message");
      this.setState({ message: '' });

    }

  }

  handleRemoveUser() {
    console.log('remove this user');
  }

  handleContinue() {
    if (this.state.privateTable) {
      this.setState({ keyView: true, settings: false })
    } else
      this.setState({ settings: false })
  }

  handleKey() {
    this.setState({ keyView: false });
  }

  Colors() {
    return (
      <div className="colors-panel">
        <div className="color clear" onClick={this.handleClear}></div>
        <div className="color" style={{ background: '#ffffff' }}
             onClick={(str) => this.handleChangeColor('#ffffff')}></div>
        <div className="color" style={{ background: "#e400f6" }}
             onClick={(str) => this.handleChangeColor('#e400f6')}></div>
        <div className="color" style={{ background: '#ffc865' }}
             onClick={(str) => this.handleChangeColor('#ffc865')}></div>
        <div className="color" style={{ background: '#00ee32' }}
             onClick={(str) => this.handleChangeColor('#00ee32')}></div>
        <div className="color" style={{ background: '#00e1ea' }}
             onClick={(str) => this.handleChangeColor('#00e1ea')}></div>
      </div>
    )
  }


  render() {

    return (
      <div className="gameScreen">

        <div className="game-container">
          <div className="game-chat">
            <div className="messages">messages messages</div>
            <input type="text" className="chat-input" onChange={this.handleMessage} onKeyUp={this.handleSendMessage}
                   value={this.state.message}/>
          </div>
          <div className="main-game">

            {!this.state.settings ? (this.state.keyView ? <KeyInfo {...{
              keyValue: this.state.key,
              closeInfo: () => {
                this.handleKey()
              }
            }}/> : <GameView2/>) : <GameSettings {...{
              handlePrivateTable: () => {
                this.setState({ privateTable: true })
              },
              handlePublicTable: () => {
                this.setState({ privateTable: false })
              },
              continueFunc: () => {
                this.handleContinue()
              },
              privateTable: this.state.privateTable

            }} />}
            

            </div>

          <div className="players-list" style={{float:'left'}}>

            <UserPanel {...{
              userName: 'User1',
              points: 123,
              panelType: 1,
              adminView: true,
              removeUserfunc: () => {
                this.handleRemoveUser()
              }

            }}/>
            <UserPanel {...{
              userName: 'dlugieimiezebysprawdziczysiezmiesci',
              points: 123,
              panelType: 2,
              adminView: true,
              removeUserfunc: () => {
                this.handleRemoveUser()
              }

            }}/>

            <UserPanel {...{
              userName: 'kaczka69',
              points: 123,
              panelType: 3,
              adminView: true,
              removeUserfunc: () => {
                this.handleRemoveUser()
              }

            }}/>
            <UserPanel {...{
              userName: 'kalambury09865346',
              points: 123,
              panelType: 4,
              adminView: true,
              removeUserfunc: () => {
                this.handleRemoveUser()
              }

            }}/>

          </div>
          <div className="rectangle" style={{ color: 'white', float:'left' }}>
            <p>1:30</p>
          </div>

          <div className="rectangle" style={{ color: 'white', float:'left' }}>
            <p>Przesuń się o 4 pola.</p>
          </div>
          


        </div>
      </div>
    )
  }

}

export default GameScreen;
