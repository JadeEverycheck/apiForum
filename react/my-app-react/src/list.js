import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faSignOutAlt, faUser, faComments, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';


class List extends React.Component {
	// componentWillMount() {
 //    	this.getData()
 //  	}

 //  	getData() {
 //  		const email = localStorage.getItem("mail")
 //  		const password = localStorage.getItem("password")
 //  	  	var request = new XMLHttpRequest()
 //    	request.addEventListener('load', () => {
 //      		console.log("Test: ", request)
 //    	})
	// 	request.open('GET',  "/discussions/", true)
 //    	request.setRequestHeader('Authorization', 'Basic '+btoa(email+":"+password))
 //    	request.send()
 //  	}

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
			        			<a className="nav-link" href="/New">New discussion 
			        				<span className="sr-only"></span>
			        			</a>
			      			</li>
			    		</ul>
    					<span className="navbar-text" id="user">
    						<FontAwesomeIcon icon={faUser} className="ml-2" />
    						:
    					</span>
    					<span className="ml-4">
{/*    						<button onclick="signOut()" class="btn btn-sm btn-secondary">
								<FontAwesomeIcon icon={faSignOutAlt} className="ml-2" />
   							</button>*/}
   						</span>
		  			</div>
				</nav>
				<h1 className="ml-4 mt-4">List of discussions
					<FontAwesomeIcon icon={faComments} className="ml-2" />
				</h1>
				<hr />

				<a href="/New" className="btn btn-secondary ml-4 mt-4" role="button">
					<FontAwesomeIcon icon={faPlus} className="mr-2" />
					Add a discussion
				</a>
			</div>
		);
	}
}

export default List;

ReactDOM.render(
	<List />,
	document.getElementById('root')
);

library.add(faSignOutAlt, faUser, faComments, faPlus);