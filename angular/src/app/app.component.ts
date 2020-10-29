import { Component, OnInit} from '@angular/core';
import jwt_decode from 'jwt-decode';

// let actualUserMail:string = jwt_decode(localStorage.getItem('token')).mail;


class Token {
	mail:string;
	exp:number;
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title:string = 'jade first angular';
  	token:Token;

	getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }
  	ngOnInit(){
  		this.token = this.getDecodedAccessToken(localStorage.getItem("token"));
  	}
	// actualUserMail:string = jwt_decode(localStorage.getItem('token')).mail;
	
	clear() {
		localStorage.clear();
	}
}
