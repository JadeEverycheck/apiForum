import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faSignOutAlt, faUser, faComments, faPlus, faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';


class List extends React.Component {
	_isMounted = false;
	constructor(props) {
    	super(props);
    	this.state = { 
    		listItems: []
    	};
	}

	componentDidMount() {
		this._isMounted = true;
    	this.getData()
  	}
  	
  	componentWillUnmount() {
    	this._isMounted = false;
  	}

  	getData() {
  		const email = localStorage.getItem("mail")
  		const password = localStorage.getItem("password")
  		let myInit = { method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' :'Basic '+btoa(email+":"+password)
            }
        };
        let myRequest = new Request('http://localhost:8080/discussions', myInit);

        fetch(myRequest,myInit).then(r=>r.json()).then(data => {
  			let newState ={ listItems: [] }; 
  			data.forEach(d=>newState.listItems.push({subject:d.subject,id:d.id}))
  			if (this._isMounted) {
	  			this.setState(newState);
	  		}
  		}).catch(function(error) {
  			console.log('Problem with fetch operation: ' + error.message);
		});
  	}

  	deleteItem(id){
  		const email = localStorage.getItem("mail")
  		const password = localStorage.getItem("password")
  		let myInit = { method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' :'Basic '+btoa(email+":"+password)
            }
        };
        let myRequest = new Request('http://localhost:8080/discussions/'+id, myInit);

        fetch(myRequest,myInit).then(data => {
  			let newState ={ listItems: this.state.listItems.filter(i=>i.id!==id) }; 
  			this.setState(newState);
  		}).catch(function(error) {
  			console.log('Problem with fetch operation: ' + error.message);
		});
  	}

  	signOut() {
		localStorage.clear()
		this.props.history.push('/');
  	}

  	show(id, subject) {
  		console.log(id)
		localStorage.setItem('id', id);
		localStorage.setItem('subject', subject);
  		this.props.history.push('/Show/' + id);
  	}

	render() {
		const { listItems } = this.state

		return (
			<div>
				<nav className="navbar navbar-expand-lg navbar-light bg-light">
  					<span className="navbar-brand w-25">Forum de Jade</span>
			  		<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
			    		<span className="navbar-toggler-icon"></span>
			  		</button>
			  		<div className="collapse navbar-collapse" id="navbarNav">
			    		<ul className="navbar-nav w-50">
			      			<li className="nav-item active">
			        			<a className="nav-link ml-4" href="/New">New discussion 
			        				<span className="sr-only"></span>
			        			</a>
			      			</li>
			    		</ul>
    					<span className="navbar-text ml-4" id="user">
    						<FontAwesomeIcon icon={faUser} className="mx-2" />
    						: {localStorage.getItem('mail')}
    					</span>
    					<span className="ml-4">
    						<button onClick={this.signOut.bind(this)} className="btn btn-sm btn-secondary ml-4">
								<FontAwesomeIcon icon={faSignOutAlt} />
   							</button>
   						</span>
		  			</div>
				</nav>
				<h1 className="ml-4 mt-4">List of discussions
					<FontAwesomeIcon icon={faComments} className="ml-2" />
				</h1>
				<hr />
				<div className="col-12">
					<div className="list-group">
						{
							listItems.map((item,index) => (
								<li key={index} className="list-group-item d-flex justify-content-between align-items-center bg-light mb-2 border">
									{item.subject}
									<div>
										<button className="btn btn-sm btn-primary" onClick={() => this.show(item.id, item.subject)}>
											<FontAwesomeIcon icon={faEye} className="justify-content-md-center" />
										</button>
										<button className="btn btn-sm btn-danger ml-2" onClick={()=>this.deleteItem(item.id)}>
												<FontAwesomeIcon icon={faTrashAlt} className="justify-content-md-center" />
										</button>
									</div>
								</li>
							))
						}
					</div>
				</div>
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

library.add(faSignOutAlt, faUser, faComments, faPlus, faEye, faTrashAlt);