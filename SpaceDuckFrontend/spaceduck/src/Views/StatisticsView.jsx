import React from 'react';
import Header from '../components/Header.jsx'
import './forms-style.css'
import nyanDuck from '../assets/Nyan_kaczka.png'
import address from '../configuration.json';
import Cookies from 'universal-cookie';
const cookies = new Cookies();


class Statistics extends React.Component {
    constructor() {
        super();
        this.state = {
            kalamburyPoints:0,
            chessPoints:0,
            shipsPoints:0,
            chinesePoints:0,
            chessRanking: [0,0,0],
            kalamburyRanking: [0,0,0],
            shipsRanking: [0,0,0],
            chineseRanking: [0,0,0],
            id:''
        };
    }
    componentDidMount(){
        this.state.id=cookies.get("user").id;
        this.fetchChessPoints();
        this.fetchChessRanking();
        this.fetchKalamburyPoints();
        this.fetchKalamburyRanking();
        this.fetchChinesePoints();
        this.fetchChineseRanking();       
        this.fetchShipsPoints();
        this.fetchShipsRanking();

    }

    fetchChessRanking(){
            fetch('https://localhost:' + address.chessBackendPort + address.chessRanking+'/top/3')
            .then((response) => response.json())
            .then(data => {
                this.setState({chessRanking: data.map(item => (item.points))});
                console.log(data);
            })
            .catch((error) => {
                console.log(error);                               
            });
    }   
    
    fetchKalamburyRanking(){
            fetch('https://localhost:' + address.kalamburyBackendPort + address.kalamburyRanking+'/top/3')
            .then((response) => response.json())
            .then(data => {
                this.setState({kalamburyRanking: data.map(item => (item.points))});
                console.log(data);
            })
            .catch((error) => {
                console.log(error);                               
            });
    }  
    
    fetchChineseRanking(){
            fetch('https://localhost:' + address.chineseBackendPort + address.chineseRanking+'/top/3')
            .then((response) => response.json())
            .then(data => {
                this.setState({chineseRanking: data.map(item => (item.points))});
                console.log(data);
            })
            .catch((error) => {
                console.log(error);                               
            });
    }  
    
    fetchShipsRanking(){
            fetch('https://localhost:' + address.shipsBackendPort + address.shipsRanking+'/top/3')
            .then((response) => response.json())
            .then(data => {
                this.setState({shipsRanking: data.map(item => (item.points))});
                console.log(data);
            })
            .catch((error) => {
                console.log(error);                              
            });
    }  

    fetchKalamburyPoints(){
            fetch('https://localhost:' + address.kalamburyBackendPort + address.kalamburyRanking+"/"+this.state.id)
            .then((response) => response.json())
            .then(data => {
                this.setState({kalamburyPoints: data});
                console.log(data);
            })
            .catch((error) => {
                console.log(error);               
            });

    }
    
    fetchChessPoints(){
            fetch('https://localhost:' + address.chessBackendPort + address.chessRanking+"/"+this.state.id)
            .then((response) => response.json())
            .then(data => {
                this.setState({chessPoints: data});
                console.log(data);
            })
            .catch((error) => {
                console.log(error);               
            });

    }

    fetchChinesePoints(){
            fetch('https://localhost:'+ address.chineseBackendPort + address.chineseRanking+"/"+this.state.id )
            .then((response) => response.json())
            .then(data => {
                this.setState({chinesePoints: data});
                console.log(data);
            })
            .catch((error) => {
                console.log(error);                
            });

    } 

    fetchShipsPoints(){
            fetch('https://localhost:'+ address.shipsBackendPort + address.shipsRanking+"/"+this.state.id)
            .then((response) => response.json())
            .then(data => {
                this.setState({shipsPoints: data});
                console.log(data);
            })
            .catch((error) => {
                console.log(error);                
            });

    }            
    render() {
      
        return (
            <div className="app">
                <Header />
                <h2 className="form-title">statystyki</h2>
                <img src={nyanDuck} alt="nyan kaczka" className="nyan" />


                <div className="form-container">
                    <div className="stats-container">
                        <div className="stats-inside-container1">
                            
                                <div className = "stats-card-outside">
                                    <h2 className="form-white-title">kalambury</h2>
                                    <div className="stats-inside-container2">
                                        <div classname="stats-card">
                                            <p className="form-white-title">Twój wynik </p>
                                            <p >{this.state.kalamburyPoints}</p>
                                            <p className="form-white-title">TOP 3 WYNIKI</p>
                                            <p >1. {this.state.kalamburyRanking[0]}</p>
                                            <p >2. {this.state.kalamburyRanking[1]}</p>
                                            <p >3. {this.state.kalamburyRanking[2]}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className = "stats-card-outside">
                                    <h2 className="form-white-title">statki</h2>
                                    <div className="stats-inside-container2">
                                        <div classname="stats-card">
                                            <p className="form-white-title">Twój wynik </p>
                                            <p >{this.state.shipsPoints}</p>
                                            <p className="form-white-title">TOP 3 WYNIKI</p>
                                            <p >1. {this.state.shipsRanking[0]}</p>
                                            <p >2. {this.state.shipsRanking[1]}</p>
                                            <p >3. {this.state.shipsRanking[2]}</p>
                                        </div>

                                    </div>
                                </div>

                                <div className = "stats-card-outside">
                                    <h2 className="form-white-title">chińczyk</h2>    
                                    <div className="stats-inside-container2">
                                        <div classname="stats-card">
                                            <p className="form-white-title">Twój wynik </p>
                                            <p >{this.state.chinesePoints}</p>
                                            <p className="form-white-title">TOP 3 WYNIKI</p>
                                            <p >1. {this.state.chineseRanking[0]}</p>
                                            <p >2. {this.state.chineseRanking[1]}</p>
                                            <p >3. {this.state.chineseRanking[2]}</p>
                                        </div>
                                    </div>
                                </div>
                            
                                <div className = "stats-card-outside">
                                    <h2 className="form-white-title">szachy</h2>
                                    <div className="stats-inside-container2">
                                        <div classname="stats-card">
                                            <p className="form-white-title">Twój wynik </p>
                                            <p >{this.state.chessPoints}</p>
                                            <p className="form-white-title">TOP 3 WYNIKI</p>
                                            <p >1. {this.state.chessRanking[0]}</p>
                                            <p >2. {this.state.chessRanking[1]}</p>
                                            <p >3. {this.state.chessRanking[2]}</p>
                                        </div>
                                    </div>
                                </div>

                        </div>
                        
                         <a href="/profile" className="profile-button"> powrót </a>

                        </div>
                    </div>


            </div>

        )
    }
}


export default Statistics;