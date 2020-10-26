import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';

class Message {
	user:string;
	content:string;
	date:string;
	constructor(user:string, content:string, date:Date) {
		this.user = user;
		this.content = content;
		this.date = moment(date).locale("fr").format("LLL");
	}
}

@Component({
	selector: 'app-show',
	templateUrl: './show.component.html',
	styleUrls: ['./show.component.css']
})

export class ShowComponent implements OnInit {

	id : number = 0; 
	items:Array<Message> = [];

	constructor(
    private route: ActivatedRoute,
    private router: Router  ) {}

	ngOnInit(): void {
		let stringId:string = this.route.snapshot.paramMap.get('id');
		this.id = parseInt(stringId);
		for(let i=0;i<5;i++){
			this.items.push(new Message("user","test ", new Date()));
		}
	}

}
