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
var master_service_1 = require("./master.service");
var DashboardCmp = (function () {
    function DashboardCmp(route, location, service) {
        this.route = route;
        this.location = location;
        this.service = service;
        this.events = [{
                eventId: '23v',
                name: 'Testing Event',
                description: 'This is a very long description',
                checkStart: new Date(),
                checkEnd: new Date()
            }, {
                eventId: '563',
                name: 'Testing Event 2',
                description: 'This is a very long description',
                checkStart: new Date(),
                checkEnd: new Date()
            }, {
                eventId: '23v',
                name: 'Testing Event',
                description: 'This is a very long description',
                checkStart: new Date(),
                checkEnd: new Date()
            }, {
                eventId: '563',
                name: 'Testing Event 2',
                description: 'This is a very long description',
                checkStart: new Date(),
                checkEnd: new Date()
            }];
        this.formHidden = true;
    }
    DashboardCmp.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            _this.adminId = params['adminid'];
            _this.service.getAdminDashboard(_this.adminId).then(function (res) {
                console.log(res.json());
                _this.events = res.json().events;
            });
        });
    };
    DashboardCmp.prototype.showForm = function () {
        this.formHidden = false;
    };
    DashboardCmp = __decorate([
        core_1.Component({
            selector: 'dashboard',
            templateUrl: 'app/dashboard.cmp.html',
            providers: [master_service_1.MasterService]
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, common_1.Location, master_service_1.MasterService])
    ], DashboardCmp);
    return DashboardCmp;
}());
exports.DashboardCmp = DashboardCmp;
//# sourceMappingURL=dashboard.cmp.js.map