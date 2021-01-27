import React from 'react';
import Table from '../components/Table'
import './tables-styles.css'
import Header from '../components/Header'
import addTable from '../assets/Guzik_Nowy_St.png';
import address from '../configuration.json';
import history from '../history.jsx';
import Cookies from 'universal-cookie';
import ErrorInfo from '../components/ErrorInfo.jsx';
import './passwordPopupStyle.css'

const cookies = new Cookies();
class Tables extends React.Component {
    constructor() {
        super();
        this.state = {
            tables: [],
            errorInfo:false,
            showPasswordPopup:false,
            password:'',
            correctPassword:'',
            table:''
        };
        this.handlePassword = this.handlePassword.bind(this);
        this.showPopup = this.showPopup.bind(this);
        this.passwordPopup = this.passwordPopup.bind(this);
        this.handleClosePopup = this.handleClosePopup.bind(this);
        this.addToPrivateTable=this.addToPrivateTable.bind(this);
    }



    componentDidMount(){
        cookies.set('currentTable', '', { path: '/' });
        fetch('https://'+address.chineseURL+address.room+'/all')
            .then((response) => response.json())
            .then(data => {
                this.setState({tables: data});
            })
            .catch((error) => {
                this.setState({errorInfo: true})
            });
    }

    async addToGame(){
        var user = cookies.get('user');
        try{
            const response = await fetch('https://'+address.chineseURL+address.room+'/'+this.state.table.id+'/'+user.id+'/'+user.userName, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "RoomId": this.state.table.id,
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

    showPopup(arg){
        this.setState({showPasswordPopup:true, correctPassword:arg.roomConfiguration.password, table:arg})
    }
    handlePassword(event){
        this.setState({password: event.target.value})
    }
    handleClosePopup(){
        this.setState({showPasswordPopup:false})
    }
    async addToPrivateTable(){
        cookies.set('currentTable', this.state.table, { path: '/' });
        await this.addToGame().then(()=>{history.push('/game');});
    }
    passwordPopup(){
        return(
            <div className="overlay">
                <div className="instructionPopup passwordPopup">
                    <a className="close" href='#' onClick={this.handleClosePopup}>X</a>
                    <h2>Podaj hasło do stołu</h2>
                    <input type="text" value={this.state.password} onChange={this.handlePassword}/>
                    {(this.state.password==this.state.correctPassword) ? <button onClick={this.addToPrivateTable}>graj</button> : <p>zle haslo</p>}
                </div>
            </div>

        )
    }

    render() {

        return (
            <div className="app">
                {this.state.errorInfo ? <ErrorInfo {...{
                    visible: ()=>{this.setState({errorInfo:false})}
                }}/> : null}
                {this.state.showPasswordPopup ? this.passwordPopup() : null}
                <Header/>
                <div className="kalambury-header"><p>Chinczyk</p></div>
                <div className="tables">
                    <ul className="card tables-header">
                        <li>STOŁ</li>
                        <li>GRACZE</li>
                        <li>RUNDY</li>
                        <li>CZAS</li>
                        <li>RODZAJ</li>
                        <li className="game-button">BUTTON</li>
                    </ul>
                    <ul>
                        {this.state.tables.map(arg =>
                            <li key={arg.id}>
                                <Table id={arg.id} players={arg.players} isFull={arg.isFull} roomConfiguration={arg.roomConfiguration} table={arg} passwordPopup={()=>{this.showPopup(arg)}}/>
                            </li>
                        )}
                    </ul>
                    <button className="add-table table-button" type="button" onClick={() => {history.push('/game')}}>
                        <img src={addTable} className="add-table-image" alt="Add table"/>
                    </button>
                </div>
            </div>
        )
    }
}


export default Tables;