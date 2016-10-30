import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import {MasterService} from "./master.service";

@Component({
  selector: 'event',
  templateUrl: 'app/event.cmp.html',
  providers: [ MasterService ]
})
export class EventCmp implements OnInit{
    checkins;
    eventId;
    event;

    constructor(private service: MasterService,
                private route: ActivatedRoute) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.eventId = params['eventid'];
            this.service.getInitialCheckIns(this.eventId).then(res => {
                console.log(res.json())
                this.checkins = res.json().checks;
                this.event = res.json().ronaldSet;
            })
        });
    }
}
