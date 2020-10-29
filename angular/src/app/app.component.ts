import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	mail:string="";
	title:string = "Angular App";
	constructor(private router: Router) {}

	decodeToken(){
		this.mail="";
		let token = localStorage.getItem("token");
		if (token == null) {
			return
		}
		let jwt = token.split(".");
		if (jwt.length != 3) {
			return
		}
		let payload = jwt[1];
		let payloadDecoded = atob(payload);
		this.mail = JSON.parse(payloadDecoded).mail;
	}
 
	ngOnInit(){
		this.router.events.subscribe(()=>this.decodeToken());
	}

	clear() {
		localStorage.clear();
	}
}
