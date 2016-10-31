import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router }   from '@angular/router';
import { Location }                 from '@angular/common';
import {MasterService} from "./master.service";
import { Observable } from 'rxjs/Observable';
// import * as json2csv from 'json2csv/bin/json2csv';
// import * as json2csv from 'json2csv/bin/json2csv.js';

declare var io: any;
declare var json2csv: any;

@Component({
  selector: 'event',
  templateUrl: 'app/event.cmp.html',
  providers: [ MasterService ]
})
export class EventCmp implements OnInit{
    checkins = [
        {
            number:"11234567890",
            content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",

        },
        {
            number:"1234567890",
            content:'Mac Voeu fugiat nulla pariatur. Excepteur sint occaecat cupidatat gelsang'
        },
        {
            number:"1234567890",
            content:'Mac Vogelsang 2'
        },
        {
            number:"1234567890",
            content:'Mac Vlore eu fugiat nulogelsang 3'
        },
        {
            number:"11234567890",
            content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",

        },
        {
            number:"1234567890",
            content:'Mac Voeu fugiat nulla pariatur. Excepteur sint occaecat cupidatat gelsang'
        },
        {
            number:"1234567890",
            content:'Mac Vogelsang 2'
        },
        {
            number:"1234567890",
            content:'Mac Vlore eu fugiat nulogelsang 3'
        }
    ];
    eventId;
    event;
    socketConnection;
    selected;
    userCheckIn = "";

    constructor(private service: MasterService,
                private route: ActivatedRoute
                private router: Router) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.eventId = params['eventid'];
            this.service.getInitialCheckIns(this.eventId).then(res => {
                console.log(res.json())
                this.checkins = res.json().checks;
                this.event = res.json().ronaldSet[0];

                if (this.event == null){
                    this.router.navigate('/notfound');
                }


                var socket;
                socket = io();
                socket.on(this.eventId.toLowerCase(), (data) => {
                    console.log(data, 'inside socket')
                    for (var key in this.checkins) {
                        if (this.checkins[key].number == data.number ){
                            this.checkins[key].content = data.content;
                            return
                        }
                    }
                    this.checkins.unshift(data);
                });
            })
        });
    }

    exportCSV(){
        var filename = "event"+this.eventId+".csv";
        var fields = ['number','content'];
        var csv = json2csv({ data: this.checkins, fields: fields });
        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    getUser(number){
        this.selected = number;
        this.service.getUserCheckIn(this.event.adminId, number).then(res => {
            console.log(res.json())
            this.userCheckIn = res.json().events;
        })
    }
}
