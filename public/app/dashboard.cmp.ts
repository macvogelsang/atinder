import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import {MasterService} from "./master.service";

@Component({
  selector: 'dashboard',
  templateUrl: 'app/dashboard.cmp.html',
  providers: [MasterService]
})
export class DashboardCmp implements OnInit{

    adminId:string;
    events = [{
        eventId:'23v',
        name:'Testing Event',
        description:'This is a very long description',
        checkStart:new Date(),
        checkEnd: new Date()
    },{
        eventId:'563',
        name:'Testing Event 2',
        description:'This is a very long description',
        checkStart:new Date(),
        checkEnd: new Date()
    },{
        eventId:'23v',
        name:'Testing Event',
        description:'This is a very long description',
        checkStart:new Date(),
        checkEnd: new Date()
    },{
        eventId:'563',
        name:'Testing Event 2',
        description:'This is a very long description',
        checkStart:new Date(),
        checkEnd: new Date()
    }];
    formHidden: boolean = true;

    constructor(private route: ActivatedRoute,
                private location: Location,
                private service: MasterService,
                private router: Router) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.adminId = params['adminid'];
            this.service.getAdminDashboard(this.adminId).then(res => {
                console.log(res.json())
                this.events = res.json().events;
            })
        });
    }
    gotoEvent(eventId){
        let link = ['/', this.adminId, eventId];
        this.router.navigate(link);
    }
    showForm(){
        this.formHidden = false;
    }
}
