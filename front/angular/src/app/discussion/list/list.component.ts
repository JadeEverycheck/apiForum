import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';


class Discussion {
	id: number;
	subject:string;
}

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
	discussions:Array<Discussion>=[];

	constructor(
		private httpClient: HttpClient
	) { }

	ngOnInit(): void {
		let headers = {
	    	'Authorization': 'Bearer ' + localStorage.getItem('token')
		};
    
		this.httpClient.get<Array<Discussion>>(environment.url + "/discussions", { headers: headers }).subscribe(
			r => {
				this.discussions = r; 
			}
		);
	}

	deleteDiscussion(id){
		let headers = {
	    	'Authorization': 'Bearer ' + localStorage.getItem('token')
		};
    	this.httpClient.delete<any>(environment.url+"/discussions/" + id, { headers: headers }).subscribe(
			r => {
				this.discussions = this.discussions.filter(item => item.id != id);
			}
    	);
	}

}
