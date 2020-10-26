import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-show',
	templateUrl: './show.component.html',
	styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {

	id : number = 0; 

	constructor(
    private route: ActivatedRoute,
    private router: Router  ) {}

	ngOnInit(): void {
		let stringId:string = this.route.snapshot.paramMap.get('id');
		this.id = parseInt(stringId);
	}

}
