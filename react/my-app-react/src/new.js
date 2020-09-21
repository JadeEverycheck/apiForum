import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faSignOutAlt, faUser, faComments, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';


class New extends React.Component {
	setSubject = (event) => {
    	this.setState({subject: event.target.value});
  	}

  	addDiscussion = () => {
  		alert('Button clicked')
  	   	this.props.history.push('/List');
  	}

  	signOut() {
		localStorage.clear()
		this.props.history.push('/');
  	}

	render() {
		return (
			<div>
				<nav className="navbar navbar-expand-lg navbar-light bg-light">
  					<a className="navbar-brand w-25">Forum de Jade</a>
			  		<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
			    		<span className="navbar-toggler-icon"></span>
			  		</button>
					<div className="collapse navbar-collapse" id="navbarNav">
		    			<ul className="navbar-nav w-50">
		      				<li className="nav-item active">
		        				<a className="nav-link" href="/List">List of discussions 
		        					<span className="sr-only"></span>
		        				</a>
			      			</li>
			    		</ul>
    					<span className="navbar-text" id="user">
							<FontAwesomeIcon icon={faUser} className="ml-2" />
    						: {localStorage.getItem('mail')}
    					</span>
		    			<span className="ml-4">
    						<button onClick={this.signOut.bind(this)} className="btn btn-sm btn-secondary">
								<FontAwesomeIcon icon={faSignOutAlt} />
   							</button>
    					</span>
		  			</div>
				</nav>
				<h1 className=" mt-4 ml-4">Create a new discussion</h1>
				<hr />
				<form id="newDisc-form">
					<div className="form-group mx-4">
    					<label htmlFor="subject">Add a subject</label>
    					<textarea className="form-control" id="subject" name="subject" rows="1" onChange={this.setSubject} required></textarea>
  					</div>
  					<button type="submit" className="btn btn-primary ml-4" onClick={this.addDiscussion.bind(this)}>
							<FontAwesomeIcon icon={faPlus} className="mr-2" />
  						Add
  					</button>
  				</form>
			</div>
		);
	}
}

export default New;

ReactDOM.render(
	<New />,
	document.getElementById('root')
);

library.add(faSignOutAlt, faUser, faComments, faPlus);