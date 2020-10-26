import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './discussion/list/list.component';
import { NewComponent } from './discussion/new/new.component';
import { ShowComponent } from './discussion/show/show.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'discussions', component: ListComponent },
	{ path: 'create-discussion', component: NewComponent },
	{ path: 'discussions/:id', component: ShowComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
