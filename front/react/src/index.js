import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { Route, Link, Switch, HashRouter, BrowserRouter} from "react-router-dom";

import Login from "./login.js";
import ListDiscussions from "./listDiscussions.js";
import NewDiscussion from "./newDiscussion.js";
import ShowDiscussion from "./showDiscussion.js";


class Index extends React.Component {
	render() {
		return (
			<div>
				<BrowserRouter>
					<Switch>
						<Route exact path="/" component={Welcome} />
						<Route path="/Login" component={Login} />
						<Route path="/ListDiscussions" component={ListDiscussions} />
						<Route path="/NewDiscussion" component={NewDiscussion} />
						<Route path={"/ShowDiscussion/:id"} component={ShowDiscussion} />
					</Switch>
				</BrowserRouter>
			</div>
		);
	}
}

class Welcome extends React.Component {
	render() {
		return (
			<div>
				<h1 className="ml-4">Welcome to our discussion group</h1>
				<hr />
				<Link to={{pathname: '/Login'}} className="btn btn-primary ml-4">Log in
					<FontAwesomeIcon icon={faSignInAlt} className="ml-2" />
				</Link>{' '}
			</div>
		);
	}
}

ReactDOM.render(
	<Index />,
	document.getElementById('root')
);


library.add(faSignInAlt);