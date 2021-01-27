import React from 'react';
import Header from '../components/Header.jsx'
import { Redirect } from 'react-router-dom'
import './forms-style.css'
import nyanDuck from '../assets/Nyan_kaczka.png'
import address from '../configuration.json';
class Register extends React.Component {
    constructor() {
        super();
        this.state = {
            name:'',
            mail: '',
            password:'',
            repeatedPassword:'',
            correctPassword:false,
            correctRepeatedPassword:false,
            correctEmail:false,
            correctData:false,
            registered:false
          
        };
        this.handleName = this.handleName.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleRepeatedPassword = this.handleRepeatedPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
           
    }
    handleEmail(event) {
        this.setState({mail: event.target.value});
    }
    handleName(event) {
        this.setState({name: event.target.value}); 
    }
    handlePassword(event) {
        this.setState({password: event.target.value}); 
    }
    handleRepeatedPassword(event) {
        this.setState({repeatedPassword: event.target.value});   
    }

    handleSubmit(event) {
    
        fetch("http://"+window.location.hostname + ":" + address.backendPort+address.register, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({
                        "Name": this.state.name,
                        "Email": this.state.mail,
                        "Password": this.state.password
                    }),
                })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson=="This user can not be created!"){
                //information about taken login/email
                 var error = document.createElement('p');
                 error.style="color: #D62222; background: rgba(255,0,0,0.1); display:inline-block; padding:10px; width:80%; border: solid 1px #D62222;";
                 error.innerHTML="Login lub email jest już zajęty!";
                 var errorDiv = document.getElementsByClassName('errorContainer')[0];
                 if(errorDiv.childElementCount!=0)
                    errorDiv.removeChild(errorDiv.lastElementChild);
                 errorDiv.style="visibility:visible;";
                 errorDiv.append(error);
                 
                }else{
                    //registered succesfully -> redirect for login view
                    this.setState({registered: true});
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

    emailValidation(email){
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    strongPassword(password){
        var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        return re.test(password)
    }   
    render() {
        //password validation
        let inputStyle = { };
        if(this.state.password!==this.state.repeatedPassword){
            inputStyle={
                'border': 'solid red 1px',
                'background': 'rgba(255,0,0,0.3)'
            }
             this.state.correctRepeatedPassword = false;

        }else{
            inputStyle={}   
            this.state.correctRepeatedPassword = true; 
        }
        let passwordStyle = {};
        //strong password validation
        if(!this.strongPassword(this.state.password)){
            passwordStyle = {
                'border': 'solid red 1px',
                'background': 'rgba(255,0,0,0.3)'
            }
             this.state.correctPassword = false;
        }else{
            passwordStyle={};
            this.state.correctPassword = true;
        }

        //email validation
        let emailStyle ={};
        if(!this.emailValidation(this.state.mail)){
            emailStyle={
                'border': 'solid red 1px',
                'background': 'rgba(255,0,0,0.3)'
            }
             this.state.correctEmail = false;
        }else{
            emailStyle={};
            this.state.correctEmail =true

        }
        //checking if all datas are correct
        if(this.state.correctEmail && this.state.correctPassword && this.state.correctRepeatedPassword&& this.state.name!=''){
            this.state.correctData=true;
        }else{
            this.state.correctData=false;
        }
       
        //redirecting to login View
       if (this.state.registered === true) {
          return <Redirect to='/login' />
        }


        return (
            <div className="app">
                <Header />
                <h2 className="form-title">Rejestracja</h2>
                <img src={nyanDuck} alt="nyan kaczka" className="nyan" />
                <div className="form-container">
                   
                    <div>
                     <div className='errorContainer'></div>
                        <input type="text" value={this.state.name} onChange={this.handleName} placeholder="login" defaultValue={this.state.name} /><br/>
                        <input style={emailStyle} value={this.state.mail} type="text"  onChange={this.handleEmail} placeholder="email" defaultValue={this.state.mail} /><br/>
                        {!this.state.correctPassword ? <p className='incorrectPassword'>Użyj silnego hasła. Silne hasło zawiera minimum jedną dużą i małą literę, cyfrę oraz znak specialny. Minimalna długość hasła to 8 znaków.</p>:null}
                        <input style={passwordStyle} type="password" value={this.state.password} onChange={this.handlePassword} placeholder="hasło" defaultValue={this.state.password}/><br/>
                        <input style={inputStyle} type="password"  onChange={this.handleRepeatedPassword} placeholder="powtórz hasło" defaultValue={this.state.repeatedPassword}/><br/>
                        {this.state.correctData ? (<input type="submit" value="Zarejestruj" onClick={this.handleSubmit} enabled="true"/>) : (<input type="submit" value="Zarejestruj"  disabled="true"/>)}
                 </div>
                </div>

            </div>
        )
    }
   
}


export default Register;