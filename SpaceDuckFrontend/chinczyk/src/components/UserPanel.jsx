import React from 'react';
import PropTypes from 'prop-types';
import duck1 from '../assets/Kaczka_fuksja.png';
import duck2 from '../assets/Kaczka_niebieski.png';
import duck3 from '../assets/Kaczka_zielona.png';
import duck4 from '../assets/Kaczka_yellow.png';
import close from '../assets/close.png';

class UserPanel extends React.Component{
	static propTypes = {
		userName: PropTypes.string.isRequired,
		points: PropTypes.number.isRequired,
		panelType: PropTypes.number.isRequired,
		adminView: PropTypes.bool,
		removeUserfunc: PropTypes.func,

	};

	constructor(...props){
		super(...props);

	}
	chooseIcon(){
		if(this.props.panelType==1)
			return(<img src={duck1} alt="duck"/>)
		if(this.props.panelType==2)
			return(<img src={duck2} alt="duck"/>)
		if(this.props.panelType==3)
			return(<img src={duck3} alt="duck"/>)
		if(this.props.panelType==4)
			return(<img src={duck4} alt="duck"/>)
	}

	render(){
		const {
			userName,
			points,
			panelType,
			adminView,
			removeUserfunc
		} = this.props;

		return(
			<div className="userPanel">
				{this.chooseIcon()}
				<div className="userInfo">
					<p className="userName">{this.props.userName}</p>
					<p className="userPoints">{this.props.points}</p>
				</div>
				{this.props.adminView ? <img src={close} alt="x" className="removeUser" onClick={this.props.removeUserfunc}/> : null}
			</div>
		)
	}

}
export default UserPanel;