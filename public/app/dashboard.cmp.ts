import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

@Component({
  selector: 'dashboard',
  templateUrl: 'app/dashboard.cmp.html'
})
export class DashboardCmp implements OnInit{

    adminId:string;
     
    constructor(private route: ActivatedRoute,
                private location: Location) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.adminId = params['id'];
            // this.heroService.getHero(id)
            // .then(hero => this.hero = hero);
        });
    }
}
