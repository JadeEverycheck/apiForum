import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';


class Discussion {
	subject:string;
}

@Component({
	selector: 'app-new',
	templateUrl: './new.component.html',
	styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {
	discussion:Discussion;
	newDiscussion:string ="";
	constructor(
		private httpClient: HttpClient,
		private route: ActivatedRoute,
    	private router: Router
    ) {};

	ngOnInit(): void {
	}

	createDiscussion() {
		let headers = {
	    	'Authorization': 'Bearer ' + localStorage.getItem('token')
		};
		let body = { 
			"subject": this.newDiscussion
		};
    	this.httpClient.post<Discussion>(environment.url+"/discussions", body, { headers: headers }).subscribe(
			r => {
				this.router.navigate(['/discussions']);
			}
    	);
	}

}
