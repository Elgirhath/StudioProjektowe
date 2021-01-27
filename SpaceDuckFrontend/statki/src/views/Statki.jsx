import React from 'react';
import Header from '../components/Header'
import './szachy-styles.css';
import cosmoDuck from '../assets/Cosmo_duck.png'
import address from '../configuration.json';
import Cookies from 'universal-cookie';
import ErrorInfo from '../components/ErrorInfo.jsx';
const cookies = new Cookies();
class Statki extends React.Component {
    constructor() {

        super();
        this.state = {
            guest: false,
            instructionPopup:false,
            guestName:'',
            ranking: [],
            rankingLoaded: false,
            errorInfo: false,
        }
       this.playAsGuest = this.playAsGuest.bind(this);
       this.handleInstruction = this.handleInstruction.bind(this);
       this.handleCloseInstruction = this.handleCloseInstruction.bind(this);
       this.handleChange = this.handleChange.bind(this);
       this.goToMainService = this.goToMainService.bind(this);
       this.saveGuestName  = this.saveGuestName.bind(this);      
    }
    async getUserInfo(userId) {
        try{
            const response = await fetch(window.location.origin + ':' + address.userserviceBackendPort + '/api/user/info/'+userId, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                }
            });

            if(!response.ok){
                throw Error(response.statusText);
            }

            var data = await response.json();
        } catch(error){
            console.error(error)
            this.setState({errorInfo: true})
        }
        return data;
    }
    // componentDidMount(){
    //     fetch("http://" + window.location.hostname+':'+address.shipsBackendPort+address.ranking+"/top/5", {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json' 
    //             }
    //         }) 
    //         .then(response => response.json())
    //         .then(data => {
    //             var it = 1;
    //             Promise.all(
    //                 data.map((arg) => {
    //                     arg.place = it;
    //                     it = it + 1;
    //                     this.state.ranking.push(arg);

    //                     return fetch("http://" + window.location.hostname+':' + address.userserviceBackendPort + '/api/user/info/'+arg.userId, {
    //                         method: 'GET',
    //                         headers: {
    //                             'Accept': 'application/json',
    //                             'Content-Type': 'application/json' 
    //                         }
    //                     });
    //             }))
    //             .then(response => Promise.all(response.map(r => r.json())))
    //             .then(data => {
    //                 this.state.ranking.forEach(r => r.name = data.find(u => u.id == r.userId).userName);
    //             })
    //             .then(()=>{
    //                 this.setState({rankingLoaded: true});
    //             })
    //             .catch((error) => {
    //                 console.error(error)
    //                 this.setState({errorInfo:true})
    //             });
    //         })
    //         .catch((error) => {
    //             console.error(error)
    //             this.setState({errorInfo:true})
    //         });
    // }

    getRanking(){
        return  this.state.ranking.map(arg => 
            <h3>{arg.place}. {arg.name}</h3>
        )
    }
    playAsGuest(){
        this.setState({guest:true});
    }
    handleInstruction(){
    	this.setState({instructionPopup:true});
    }
    handleCloseInstruction(){
    	this.setState({instructionPopup:false});
    }
    handleChange(event) {
        this.setState({guestName: event.target.value});    
    }
     goToMainService(){
       cookies.set('game', 'szachy', { path: '/' });
    }
    unLogged(){
    	return(
    		<div className="asGuest">
    			<a href={"http://" + window.location.hostname + ":" + address.mainPort + "/login"} onClick={this.goToMainService} className="button inline-button"> Zaloguj </a>
             	
    		</div>
    		)
    }
    saveGuestName(){
    	if(this.state.guest==true){
    		localStorage.setItem('guest', this.state.guestName);
    	};
    }
    showInstructionsPopup(){
    	return(
    	<div className="overlay">
    			<div className="instructionPopup">	
    				<a href='#' onClick={this.handleCloseInstruction}>X</a>
    				<p><b>Statki</b><br/><br/>Każdy z graczy posiada po dwie plansze o wielkości 10x10 pól. Na jednym z kwadratów gracz zaznacza swoje statki, których położenie będzie odgadywał przeciwnik. Na drugim zaznaczone zostają trafione statki przeciwnika i oddane strzały. Statki ustawiane są w pionie lub poziomie, w taki sposób, aby nie stykały się one ze sobą ani bokami, ani rogami. 
Trafienie okrętu przeciwnika polega na strzale, który jest odgadnięciem położenia jakiegoś statku. Strzały oddawane są naprzemiennie. W przypadku strzału trafionego, gracz kontynuuje strzelanie (czyli swój ruch) aż do momentu chybienia. Zatopienie statku ma miejsce wówczas, gdy gracz odgadnie położenie całego statku. 
Wygrywa ten, kto pierwszy zatopi wszystkie statki przeciwnika.<br/>
					<br/><b>Punktacja</b><br/><br/>
					Użytkownik, który wygrał: +100 punktów<br/>
					Użytkownik, który przegrał: -50 punktów<br/>
					</p>
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
            <Header/>
             <div className="kalambury-header"><p>Statki</p></div>
             <div className="main-container">
             	<div className="left-side">
             		<div className="ticket">
             			{(cookies.get('user'))==undefined ? this.unLogged() : null}

             			<div>
             			{this.state.guest || (cookies.get('user'))!=undefined ? <a href="/tables" className="button " onClick={this.saveGuestName}> Graj </a>:null}
             			</div>
             		</div>
             		

             	</div>
             	<div className="right-side">
             		<div className="ticket">
             				<h2>Ranking</h2>
             				{this.getRanking()}
             		</div>
             		<div className="ticket">
             				<h2>Instrukcja</h2>
 <p>Każdy z graczy posiada po dwie plansze o wielkości 10x10 pól. Na jednym z kwadratów gracz zaznacza swoje statki, których położenie będzie odgadywał przeciwnik. Na drugim zaznaczone zostają trafione statki przeciwnika i oddane strzały. Statki ustawiane są w pionie lub poziomie, w taki sposób, aby nie stykały się one ze sobą ani bokami, ani rogami. </p>
             				<button className="button" onClick={this.handleInstruction}>Czytaj dalej</button>
             		</div>
             	</div>
             	<img src={cosmoDuck} className="cosmoDuck-img" alt="cosmoDuck"/>
             </div>
             {this.state.instructionPopup ? this.showInstructionsPopup():null}
            </div>

            )
        }
    }
    export default Statki;