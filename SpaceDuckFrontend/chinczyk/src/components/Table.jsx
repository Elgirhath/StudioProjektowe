import React from 'react';
import watch from '../assets/Obserwuj.png';
import locked from '../assets/lock.png';
import play from '../assets/play.png';
import unlocked from '../assets/Unlocked.png';
import address from '../configuration.json';
import history from '../history.jsx';
import Cookies from 'universal-cookie';
import ErrorInfo from './ErrorInfo.jsx';
const cookies = new Cookies();

class Table extends React.Component {
    constructor() {
        super();
        this.state={
            errorInfo:false
        }
    }

    async addToGame(){
        var user = cookies.get('user');
        try{
            const response = await fetch('https://'+address.chineseURL+address.room+'/'+this.props.table.id+'/'+user.id+'/'+user.userName, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "RoomId": this.props.table.id,
                    "PlayerId": user.id,
                    "PlayerName":user.userName
                }),
            });

            if(!response.ok){
                throw Error(response.statusText);
            }

            const json = await response.json();
        } catch(error){
            this.setState({errorInfo: true});
        }
    }

    async joinGame(){
        cookies.set('currentTable', this.props.table, { path: '/' });
        await this.addToGame().then(()=>{history.push('/game');});
    }

    goToGame(){
        if(this.props.isFull){
            return (
                <button className="table-button" type="button">
                    <img src={watch} className="watch-table-image" alt="Watch table"/>
                </button>
            );
        }
        else if(this.props.roomConfiguration.isPrivate){
            return(
                <button className="table-button" type="button" onClick={(str) => this.props.passwordPopup(this.props.roomConfiguration.password)}>
                    <img src={play} className="play-image" alt="play"/>
                </button>
            );
        } else {
            return(
                <button className="table-button" type="button" onClick={() => this.joinGame()}>
                    <img src={play} className="play-image" alt="play"/>
                </button>
            );
        }
    }

    getRoundDuration(){
        var minutes = Math.floor(this.props.roomConfiguration.roundDuration / 60);
        var seconds = this.props.roomConfiguration.roundDuration % 60;
        if (seconds < 10) {
            return minutes + ':0' + seconds;
        }
        return minutes + ':' + seconds;
    }

    getTableVisibility(){
        if(this.props.roomConfiguration.isPrivate){
            return <img src={locked} className="table-image" alt="locked table"/>
        }
        else {
            return <img src={unlocked} className="table-image" alt="unlocked table"/>
        }
    }


    render() {

        return (
            <div>
                {this.state.errorInfo ? <ErrorInfo {...{
                    visible: ()=>{this.setState({errorInfo:false})}
                }}/> : null}
                <ul className="card">
                    <li>#{this.props.id}</li>
                    <li className="players-names">{this.props.players.map(plr => plr.name + '  ')}</li>
                    <li>{this.props.roomConfiguration.roundCount}</li>
                    <li>{this.getRoundDuration()}</li>
                    <li>{this.getTableVisibility()}</li>
                    <li>
                        {this.goToGame()}
                    </li>
                </ul>
            </div>
        )
    }
}


export default Table;