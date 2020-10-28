import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import jwt_decode from 'jwt-decode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';


class ApiUser{
	id:number
	mail:string
}

class ApiMessage {
	id:number;
	user:ApiUser;
	content:string;
	date:Date;
}

class Discussion {
	subject:string;
}

class Message {
	id:number;
	user:string;
	content:string;
	date:string;
	constructor(am:ApiMessage) {
		this.user = am.user.mail;
		this.content = am.content;
		this.date = moment(am.date).locale("fr").format("LLL");
		this.id = am.id;
	}
}

@Component({
	selector: 'app-show',
	templateUrl: './show.component.html',
	styleUrls: ['./show.component.css']
})

export class ShowComponent implements OnInit {
	discussion:Array<Message>=[];
	id:number;
	newMessage:string ="";
	subject:string = "";

	constructor(
		private httpClient: HttpClient,
    	private route: ActivatedRoute,
    	private router: Router
    ) {};

	ngOnInit(): void {
		let stringId:string = this.route.snapshot.paramMap.get('id');
		this.id = parseInt(stringId);

		let headers = {
	    	'Authorization': 'Bearer ' + localStorage.getItem('token')
		};
		this.httpClient.get<Array<ApiMessage>>(environment.url + "/discussions/" + this.id + "/messages", { headers: headers })
		.subscribe(
			(r:Array<ApiMessage>) => {
				this.discussion = r.map(e=>new Message(e)); 
			}
		);
		this.httpClient.get<Discussion>(environment.url + "/discussions/" + this.id , { headers: headers })
		.subscribe(
			r => {
				this.subject = r.subject; 
			}
		);
	}

	addMessage(){
		let headers = {
	    	'Authorization': 'Bearer ' + localStorage.getItem('token')
		};
		let body = { 
			"content": this.newMessage
		};
    	this.httpClient.post<ApiMessage>(environment.url+"/discussions/" + this.id + "/messages", body, { headers: headers }).subscribe(
			r => { 
				this.newMessage = ""
				this.discussion.push(new Message(r));
			}
    	);
    }

    deleteMessage(id){
		let headers = {
	    	'Authorization': 'Bearer ' + localStorage.getItem('token')
		};
    	this.httpClient.delete(environment.url+"/discussions/messages/" + id, { headers: headers }).subscribe(
			r => {
				this.discussion = this.discussion.filter(item => item.id != id);
			}
    	);
    }

}
