import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import jwt_decode from 'jwt-decode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

class ApiMessage {
	id:number;
	user:string;
	content:string;
	date:Date;
}

class Message {
	id:number;
	user:string;
	content:string;
	date:string;
	constructor(am:ApiMessage) {
		this.user = am.user;
		this.content = am.content;
		this.date = moment(am.date).locale("fr").format("LLL");
		this.id = am.id;
	}
}

class Credential{
	content:string = "";
}

@Component({
	selector: 'app-show',
	templateUrl: './show.component.html',
	styleUrls: ['./show.component.css']
})

export class ShowComponent implements OnInit {
	discussion:Array<Message>=[];
	id:number = Number(localStorage.getItem("discussionId"));
	credential:Credential = new Credential();
	subject:string = localStorage.getItem("subject");
	actualUserMail:string = jwt_decode(localStorage.getItem('token')).mail;

	constructor(
		private httpClient: HttpClient,
    	private route: ActivatedRoute,
    	private router: Router,
    	private activatedRoute: ActivatedRoute
    ) {};

	ngOnInit(): void {
		let headers = {
	    	'Authorization': 'Bearer ' + localStorage.getItem('token')
		};
		this.httpClient.get<Array<ApiMessage>>(environment.url + "/discussions/" + this.id + "/messages", { headers: headers })
		.subscribe(
			(r:Array<ApiMessage>) => {
				this.discussion = r.map(e=>new Message(e)); 
			}
		);
	}

	newMessage(){
		let headers = {
	    	'Authorization': 'Bearer ' + localStorage.getItem('token')
		};
		let body = { 
			"content": this.credential.content
		};
    	this.httpClient.post<Message>(environment.url+"/discussions/" + this.id + "/messages", body, { headers: headers }).subscribe(
			// r => { 
			// 	this.discussion.push({ id: r.id, user: this.actualUserMail, content: r.content, date: r.date});
			// }
			d => {
        		let newState:Array<Message> = []; 
        		this.discussion.forEach(d=>newState.push(d));
        		newState.push({date: d.date, user:this.actualUserMail, content:d.content,id:d.id});
        		this.discussion = newState;  
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
