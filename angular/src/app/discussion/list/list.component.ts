import { Component, OnInit } from '@angular/core';

class Item {
	id: number;
	name:string;
	constructor(id:number, name:string){
		this.id =id;
		this.name = name;
	}
}

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
	items:Array<Item>=[];
	constructor() { }

	ngOnInit(): void {
		for(let i=0;i<5;i++){
			this.items.push(new Item(this.items.length,"test "+this.items.length))
		}
	}

}
