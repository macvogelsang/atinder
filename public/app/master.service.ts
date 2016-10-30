import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
// import * as io from 'socket.io-client';
declare var io: any;

@Injectable()
export class MasterService {
	private url = "silo.cs.indiana.edu:56789";
	// private headers = new Headers({'Content-Type': 'application/json'});

	constructor(private http: Http) { }
	createEvent(event) {
		return this.http
		.post('/api/createEvent', event)
		.toPromise()
		.then(res => res)
		.catch(err => console.log(err));
	}
	getAdminDashboard(adminId){
		return this.http
    	.post('/api/getAdminPage', {adminId: adminId})
		.toPromise()
		.then(res => res)
		.catch(err => console.log(err));
	}
	getInitialCheckIns(eventId) {
		return this.http
		.post('/api/getEventPage', {eventId: eventId})
		.toPromise()
		.then(res => res)
		.catch(err => console.log(err));
	}
	getUserCheckIn(adminId,phone) {
		return this.http
		.post('/api/getUserCheckIn', {adminId: adminId, number:phone})
		.toPromise()
		.then(res => res)
		.catch(err => console.log(err));
	}

	getSocketCheckIns(eventId) {
    var socket;
		let observable = new Observable(observer => {

		  socket = io();
			socket.on(eventId, (data) => {
				observer.next(data);
			});
			return () => {
				socket.disconnect();
			};
		})
		return observable;
	}
}
