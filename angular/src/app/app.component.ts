import { Component } from '@angular/core';
import jwt_decode from 'jwt-decode';

// let actualUserMail:string = jwt_decode(localStorage.getItem('token')).mail;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title:string = 'jade first angular';
  actualUserMail:string = jwt_decode(localStorage.getItem('token')).mail;
}
