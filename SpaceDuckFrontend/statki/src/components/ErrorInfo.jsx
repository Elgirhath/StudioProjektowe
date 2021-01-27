 
import React from 'react';
import './error-style.css';
import PropTypes from 'prop-types';
import errorDuck from '../assets/error_duck.png';
class ErrorInfo extends React.Component{
	  static propTypes = {
	    visible: PropTypes.func,
	  };
	  static defaultProps = {
	   	visible: ()=>{},
	  };
	constructor(...props){
		super(...props);
		
	}

	
render(){
	 const {
   	 visible
    } = this.props;

	return(
		<div className="overlay">
    			<div className="errorInfo">	
    					<a href='#' onClick={() => this.props.visible()}>X</a>
    				<p>
    				Nie można połączyć się z serwerem, spróbuj poźniej!
					</p>
					<img src={errorDuck} alt="errorDuck" />
    			</div>
    		</div>
		)
}
}
export default ErrorInfo