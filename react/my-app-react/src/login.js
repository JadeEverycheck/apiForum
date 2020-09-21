import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Link, Switch, BrowserRouter} from "react-router-dom";

import List from "./list.js";

class Login extends React.Component {
	constructor(props) {
    	super(props);
    	this.state = {mail: '', password: ''};
  	}

	changeMail = (event) => {
    	this.setState({mail: event.target.value});
    	localStorage.setItem('mail', event.target.value);
  	}

  	changePassword = (event) => {
  		this.setState({password: event.target.value});
  		localStorage.setItem('password', event.target.value);
  	}

  	formSubmited = (event) => {
    	event.preventDefault();
    	this.props.history.push('/List');
  	}

	render() {
		return (
			<div>
				<h1 className="ml-4">Identification</h1>
				<hr />
				<form onSubmit={this.formSubmited.bind(this)}>
				  <div className="login-form mx-4">
				    <label htmlFor="email">Email address</label>
				    <input type="email" className="form-control" id="email" name="email" onChange={this.changeMail}required />
				  </div>
				  <div className="form-group mt-2 mx-4">
				    <label htmlFor="password">Password</label>
				    <input type="password" className="form-control" id="password" name="password" onChange={this.changePassword} required />
				  </div>
				  <input type='submit' value="Submit" className="btn btn-secondary ml-4"/>
				</form>
			</div>
		);
	}
}

export default Login;

ReactDOM.render(
	<Login />,
	document.getElementById('root')
);