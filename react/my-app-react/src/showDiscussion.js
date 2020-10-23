import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faSignOutAlt, faUser, faComments, faPlus, faEye, faTrashAlt, faBookOpen, faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';

class ShowDiscussion extends React.Component {
	_isMounted = false;
	constructor(props) {
    	super(props);
    	this.state = {
    		id: localStorage.getItem('id'),
    		content: '',
    		listItems: [],
    		subject : localStorage.getItem('subject')
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
        let myRequest = new Request('/discussions/' + this.state.id + "/messages", myInit);

        fetch(myRequest,myInit).then(r=>r.json()).then(data => {
  			let newState ={ listItems: [] }; 
  			data.forEach(d=>newState.listItems.push({date: d.date, user:d.user.mail, content:d.content,id:d.id}))
  			 if (this._isMounted) {
  				this.setState(newState);
  			}
  		}).catch(function(error) {
  			console.log('Problem with fetch operation: ' + error.message);
		});
  	}

  	setContent = (event) => {
    	this.setState({content: event.target.value});
  	}

  	signOut() {
		localStorage.clear()
		this.props.history.push('/');
  	}

	addMessage(e) {
  		const email = localStorage.getItem("mail")
  		const password = localStorage.getItem("password")
		fetch('/discussions/' + this.state.id +'/messages', {
  			method: 'POST',
  			headers: {
    			'Accept': 'application/json',
    			'Content-Type': 'application/json',
    			'Authorization' :'Basic '+btoa(email+":"+password)
  			},
  			body: JSON.stringify({
   	 			content: this.state.content,
  			})
		}).then( d => {
        let newState ={ listItems: [] }; 
        this.state.listitem.forEach(d=>newState.listItems.push(d))
        newState.listItems.push({date: d.date, user:d.user.mail, content:d.content,id:d.id})
        this.setState(newState);
        //this.props.history.push('/ShowDiscussion/' + this.state.id)
        // this.props.history.push('/List')      
    })
		.catch(function(error) {
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
        let myRequest = new Request('/discussions/messages/' + id, myInit);

        fetch(myRequest,myInit).then(data => {
  			let newState ={ listItems: this.state.listItems.filter(i=>i.id!==id) }; 
  			this.setState(newState);
  		}).catch(function(error) {
  			console.log('Problem with fetch operation: ' + error.message);
		});
  	}

	render() {
		const { listItems } = this.state
		return (
			<div>
				<nav className="navbar navbar-expand-lg navbar-light bg-light">
  					<span className="navbar-brand">Forum de Jade</span>
			  		<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
			    		<span className="navbar-toggler-icon"></span>
			  		</button>
			  		<div className="collapse navbar-collapse" id="navbarNav">
			    		<ul className="navbar-nav mr-auto">
			    			<li className="nav-item active">
			        			<button className="nav-link ml-4 btn btn-secondary text-white btn-sm" onClick={() => this.props.history.push('/ListDiscussions')}>List of discussions 
			        				<span className="sr-only"></span>
			        			</button>
			      			</li>
			      			<li className="nav-item active">
			        			<button className="nav-link ml-4 btn btn-secondary text-white btn-sm" onClick={() => this.props.history.push('/NewDiscussion')}>New discussion 
			        				<span className="sr-only"></span>
			        			</button>
			      			</li>
			    		</ul>
    					<span className="navbar-text mr-4" id="user">
    						<FontAwesomeIcon icon={faUser} className="mx-2" />
    						: {localStorage.getItem('mail')}
    					</span>
    					<span className="mx-4">
    						<button onClick={this.signOut.bind(this)} className="btn btn-sm btn-secondary ml-4">
								<FontAwesomeIcon icon={faSignOutAlt} />
   							</button>
   						</span>
		  			</div>
				</nav>
				<h1 className="mt-4 ml-4">Discussion about: {this.state.subject}</h1>
				<hr />
				<form>
					<div className="form-group mx-4">
	    				<label>Add a message</label>
	    				<textarea className="form-control" name="content" rows="1" onChange={this.setContent} required></textarea>
	  				</div>
	  				<button className="btn btn-primary ml-4 mb-4" onClick={() => this.addMessage()}>
	  					<FontAwesomeIcon icon={faPlus} className="mr-2"/>
	  					Add a message
	  				</button>
	  			</form>
				<table className="table mx-4">
  					<thead className="thead-light">
    					<tr>
      						<th scope="col">User
      							<FontAwesomeIcon icon={faUser} className="ml-2"/>
      						</th>
      						<th scope="col">Content
      							<FontAwesomeIcon icon={faBookOpen} className="ml-2"/>
      						</th>
      						<th scope="col">Date
      							<FontAwesomeIcon icon={faCalendarDay} className="ml-2"/>
      						</th>
      						<th scope="col">Action</th>
    					</tr>
  					</thead>
  					<tbody>
  						{
							listItems.map((item,index) => (
								<tr key={index}>
									<td>{item.user}</td>
									<td>{item.content}</td>
									<td>on {item.date.substring(0, 10)} at {item.date.substring(11, 16)}</td>
									<td>
										<button className="btn btn-sm btn-danger ml-2" onClick={()=>this.deleteItem(item.id)}>
											<FontAwesomeIcon icon={faTrashAlt} className="justify-content-md-center" />
										</button>
									</td>
								</tr> 
							))
						}
	  				</tbody>
	  			</table>
			</div>
		);
	}
}

export default ShowDiscussion;

ReactDOM.render(
	<ShowDiscussion />,
	document.getElementById('root')
);

library.add(faSignOutAlt, faUser, faComments, faPlus, faEye, faTrashAlt, faBookOpen, faCalendarDay);