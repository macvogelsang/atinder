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
var master_service_1 = require("./master.service");
var EventCmp = (function () {
    function EventCmp(service, route) {
        this.service = service;
        this.route = route;
    }
    EventCmp.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            _this.eventId = params['eventid'];
            _this.service.getInitialCheckIns(_this.eventId).then(function (res) {
                console.log(res.json());
                _this.checkins = res.json().checks;
                _this.event = res.json().ronaldSet[0];
                _this.socketConnection = _this.service.getSocketCheckIns(_this.eventId).subscribe(function (res) {
                    console.log(res);
                    // this.messages.push(res);
                });
            });
        });
    };
    EventCmp = __decorate([
        core_1.Component({
            selector: 'event',
            templateUrl: 'app/event.cmp.html',
            providers: [master_service_1.MasterService]
        }), 
        __metadata('design:paramtypes', [master_service_1.MasterService, router_1.ActivatedRoute])
    ], EventCmp);
    return EventCmp;
}());
exports.EventCmp = EventCmp;
//# sourceMappingURL=event.cmp.js.map