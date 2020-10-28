import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';


class Discussion {
	subject:string;
}

class Credential{
	subject:string = "";
}

@Component({
	selector: 'app-new',
	templateUrl: './new.component.html',
	styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {
	credential:Credential = new Credential();
	discussion:Discussion;

	constructor(
		private httpClient: HttpClient,
		private route: ActivatedRoute,
    	private router: Router,
    	private activatedRoute: ActivatedRoute
    ) {};

	ngOnInit(): void {
	}

	newDiscussion() {
		let headers = {
	    	'Authorization': 'Bearer ' + localStorage.getItem('token')
		};
		let body = { 
			"subject": this.credential.subject
		};
    	this.httpClient.post<Discussion>(environment.url+"/discussions", body, { headers: headers }).subscribe(
			r => {
				this.router.navigate(['/discussions']);
			}
    	);
	}

}
