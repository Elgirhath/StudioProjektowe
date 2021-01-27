import React from 'react';
import Header from '../components/Header'
import './kalambury-styles.css';
import cosmoDuck from '../assets/Cosmo_duck.png'
import address from '../configuration.json';
import Cookies from 'universal-cookie';
import ErrorInfo from '../components/ErrorInfo.jsx';
const cookies = new Cookies();
class Kalambury extends React.Component {
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
            const response = await fetch('http://'+ window.location.hostname+ ':'+'5000/api/user/info/'+userId, {
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
			this.setState({errorInfo: true})
		}
		return data;
	}
	

	componentDidMount(){
		fetch('http://'+ window.location.hostname+ ':'+address.kalamburyURL+address.ranking+"/top/5", {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json' 
				}
			}) 
			.then(response => response.json())
			.then(data => {
				var it = 1;
				Promise.all(
					data.map((arg) => {
						arg.place = it;
						it = it + 1;
						this.state.ranking.push(arg);

						return fetch('http://'+ window.location.hostname+ ':'+'5000/api/user/info/'+arg.userId, {
							method: 'GET',
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json' 
							}
						});
				}))
				.then(response => Promise.all(response.map(r => r.json())))
				.then(data => {
					this.state.ranking.forEach(r => r.name = data.find(u => u.id == r.userId).userName);
				})
				.then(()=>{
					this.setState({rankingLoaded: true});
				})
				.catch((error) => {
				});
			})
			.catch((error) => {
                this.setState({errorInfo:true})
            });
	}

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
       cookies.set('game', 'kalambury', { path: '/' });
    }
    unLogged(){
    	return(
    		<div className="asGuest">
    			<a href={"http://"+ window.location.hostname+":"+address.mainPort+"/login"} onClick={this.goToMainService} className="button inline-button"> Zaloguj </a>
             	
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
    				<p><b>Kalambury</b><br/><br/>Celem gry jest odgadywanie haseł. Gra trwa określoną ilość tur, w każdej turze każda osoba, która zaznaczyła chęć rysowania, dostaje jedno hasło do narysowania. Każdy gracz, poza aktualnie rysującym ma możliwość odgadnięcia hasła. W sytuacji gdy hasło zostaje odgadnięte kolejna osoba dostaje hasło z możliwością rysowania. <br/>
					<br/><b>Punktacja</b><br/><br/>
					Użytkownik, który odgadł hasło bez podpowiedzi: +50 punktów<br/>
					Użytkownik, który odgadł hasło po pierwszej podpowiedzi: +30 punktów<br/>
					Użytkownik, który odgadł hasło po drugiej podpowiedzi: +20 punktów<br/>
					Użytkownik, którego hasło zostało odgadnięte:  +10 punktów<br/>
					Użytkownik, którego hasło nie zostało odgadnięte: -15 punktów<br/>
					Rezygnacja z rysowania przydzielonego hasła: -20 punktów<br/>
					
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
             <div className="kalambury-header"><p>Kalambury</p></div>
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
             				<p>Celem gry jest odgadywanie haseł. Gra trwa określoną ilość tur, w każdej turze każda osoba, która zaznaczyła chęć rysowania, dostaje jedno hasło do narysowania. Każdy gracz, poza aktualnie rysującym ma możliwość odgadnięcia hasła. W sytuacji gdy hasło zostaje odgadnięte kolejna osoba dostaje hasło z możliwością rysowania. </p>
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
    export default Kalambury;