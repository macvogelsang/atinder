import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import {MasterService} from "./master.service";
import { Observable } from 'rxjs/Observable';

declare var io: any;

@Component({
  selector: 'event',
  templateUrl: 'app/event.cmp.html',
  providers: [ MasterService ]
})
export class EventCmp implements OnInit{
    checkins;
    eventId;
    event;
    socketConnection;
    userCheckIn = "";
    socket;

    constructor(private service: MasterService,
                private route: ActivatedRoute) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.eventId = params['eventid'];
            this.service.getInitialCheckIns(this.eventId).then(res => {
                console.log(res.json())
                this.checkins = res.json().checks;
                this.event = res.json().ronaldSet[0];

                // this.socketConnection = this.service.getSocketCheckIns(this.eventId).subscribe(res => {
                this.socketConnection = this.getSocketCheckIns(this.eventId).subscribe(res => {
                    console.log(res)
                    for (var key in this.checkins) {
                        if (this.checkins[key].number == res.number ){
                            this.checkins[key].content = res.content
                            return
                        }
                    }
                    this.checkins.push(res);
                })
            })
        });
    }

    getSocketCheckIns(eventId) {
        let observable = new Observable(observer => {

            this.socket = io();
            this.socket.on(eventId, (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }

    getUser(number){
        this.service.getUserCheckIn(this.event.adminId, number).then(res => {
            console.log(res.json())
            this.userCheckIn = res.json().userCheckIn;
        })
    }
}
