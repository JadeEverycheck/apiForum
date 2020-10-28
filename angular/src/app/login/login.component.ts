import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

import { environment } from '../../environments/environment';

class Token {
	token: string ="";
}

class Credential{
	email:string = "";
	password:string = "";
}

type State = "Empty" | "Filled" | "Loading" | "Error";

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent {

	credential:Credential = new Credential();
	state:State = "Empty";

	constructor(
		private httpClient: HttpClient,
		private router: Router
	){}

    onInputChanged(){
    	this.state = (this.credential.email.length * this.credential.password.length) == 0 ? "Empty" : "Filled";
    }

    submit(){
    	this.state = "Loading";
    	this.httpClient.post<Token>(environment.url+"/login",this.credential).subscribe(
			r => {
			 localStorage.setItem('token', r.token);
			 this.router.navigate(['/discussions']);
			},
			err => {
				this.state = "Error";
			}
    	);
    }

}
