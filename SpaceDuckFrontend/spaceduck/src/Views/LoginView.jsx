import React from 'react';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom'
import Header from '../components/Header.jsx'
import './forms-style.css'
import nyanDuck from '../assets/Nyan_kaczka.png'
import Cookies from 'universal-cookie';
import address from '../configuration.json';

const cookies = new Cookies();
class Login extends React.Component {

    constructor() {
        
        super();
        this.state = {
            name: '',
            password:'',
            id:123,
            logged:false,
            
        };

        this.handleChange = this.handleChange.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        this.setState({name: event.target.value});
       
    }
    handlePassword(event) {
        this.setState({password: event.target.value});
    }

    handleSubmit(event) {
       
       
    //calling backend
      fetch("http://"+window.location.hostname + ":" + address.backendPort+address.login, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({
                        "Name": this.state.name,
                        "Password": this.state.password
                    }),
                })
            .then((response) => {
           
                if(response.status==401){
                //infromation about wrong login or password
                 var error = document.createElement('p');
                 error.style="color: #D62222; background: rgba(255,0,0,0.1); display:inline-block; padding:10px; width:80%; border: solid 1px #D62222;";
                 error.innerHTML="Błędne hasło lub login/email!";
                 var errorDiv = document.getElementsByClassName('errorContainer')[0];
       
                 if(errorDiv.childElementCount!=0)
                    errorDiv.removeChild(errorDiv.lastElementChild);
                 errorDiv.style="visibility:visible;";
                 errorDiv.append(error);
                 
                }
                if(response.status==200){
                    //success -> login 
                    response.json()
                    .then((responseJson) => {
                   cookies.set('user', responseJson, { path: '/' });
                   
                    this.setState({logged: true});
                
                
              })
         }
     })
              
            .catch((error) => {
                 var error = document.createElement('p');
                 error.style="color: #D62222; background: rgba(255,0,0,0.1); display:inline-block; padding:10px; width:80%; border: solid 1px #D62222;";
                 error.innerHTML="Nie można połączyć się z serwerem, spróbuj poźniej!";
                 var errorDiv = document.getElementsByClassName('errorContainer')[0];
       
                 if(errorDiv.childElementCount!=0)
                    errorDiv.removeChild(errorDiv.lastElementChild);
                 errorDiv.style="visibility:visible;";
                 errorDiv.append(error);
              
        });


     
    }

    render() {
        //redirect to main view
       if (this.state.logged === true && cookies.get('game')===undefined) {
          return <Redirect to='/' />
        }
        else if(this.state.logged == true){
            if(cookies.get('game')=="kalambury"){

                 window.location.assign('http://'+window.location.hostname+':'+address.kalamburyPort);
            }
            if(cookies.get('game')=="szachy"){
                 window.location.assign('http://'+window.location.hostname+':'+address.szachyPort);
            }
            if(cookies.get('game')=="statki"){
                 window.location.assign('http://'+window.location.hostname+':'+address.statkiPort);
            }
            if(cookies.get('game')=="chinczyk"){
                 window.location.assign('http://'+window.location.hostname+':'+address.chinczykPort);
            }
        }

        return (
            <div className="app">
                <Header />
                <h2 className="form-title">Logowanie</h2>
                <img src={nyanDuck} alt="nyan kaczka" className="nyan" />
                <div className="form-container">
                    
                    <div>
                     <div className='errorContainer'></div>
                      <input type="text" value={this.state.name} onChange={this.handleChange} placeholder="login/email" defaultValue={this.state.mail} /><br/>
                       <input type="password" value={this.state.password} onChange={this.handlePassword} placeholder="hasło" defaultValue={this.state.password}/><br/>
                   
                    <input type="submit" value="Zaloguj" onClick={this.handleSubmit} />
                  </div>
                </div>

            </div>
        )
    }
}


export default Login;