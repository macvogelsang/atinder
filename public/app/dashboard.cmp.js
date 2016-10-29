"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var common_1 = require('@angular/common');
var DashboardCmp = (function () {
    function DashboardCmp(route, location) {
        this.route = route;
        this.location = location;
    }
    DashboardCmp.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            _this.adminId = params['id'];
            // this.heroService.getHero(id)
            // .then(hero => this.hero = hero);
        });
    };
    DashboardCmp = __decorate([
        core_1.Component({
            selector: 'dashboard',
            templateUrl: 'app/dashboard.cmp.html'
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, common_1.Location])
    ], DashboardCmp);
    return DashboardCmp;
}());
exports.DashboardCmp = DashboardCmp;
//# sourceMappingURL=dashboard.cmp.js.map