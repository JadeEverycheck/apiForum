import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { Route, Link, Switch, HashRouter, BrowserRouter} from "react-router-dom";

import Login from "./login.js";
import List from "./list.js";
import New from "./new.js";
import Show from "./show.js";

console.log('cc')

class Index extends React.Component {
	render() {
		console.log('cc')
		return (
			<div>
				<BrowserRouter basename="/react">
					<Switch>
						<Route exact path="/" component={Welcome} />
						<Route path="/Login" component={Login} />
						<Route path="/List" component={List} />
						<Route path="/New" component={New} />
						<Route path={"/Show/:id"} component={Show} />
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