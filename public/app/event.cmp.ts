import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import {MasterService} from "./master.service";
import { Observable } from 'rxjs/Observable';
// import {json2csv} from 'json2csv';
declare var io: any;
declare var json2csv: any;

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
                    this.checkins.push(data);
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
        this.service.getUserCheckIn(this.event.adminId, number).then(res => {
            console.log(res.json())
            this.userCheckIn = res.json().userCheckIn;
        })
    }
}
