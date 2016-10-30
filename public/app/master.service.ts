import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class MasterService {
	private url = "silo.cs.indiana.edu:56789";
	// private headers = new Headers({'Content-Type': 'application/json'});

	constructor(private http: Http) { }
	createEvent(event) {
		return this.http
		.post('/createEvent', event)
		.toPromise()
		.then(res => res)
		.catch(err => console.log(err));
	}
}
