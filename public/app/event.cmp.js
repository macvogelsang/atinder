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
        this.userCheckIn = "";
    }
    EventCmp.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            _this.eventId = params['eventid'];
            _this.service.getInitialCheckIns(_this.eventId).then(function (res) {
                console.log(res.json());
                _this.checkins = res.json().checks;
                _this.event = res.json().ronaldSet[0];
                var socket;
                socket = io();
                socket.on(_this.eventId.toLowerCase(), function (data) {
                    console.log(data, 'inside socket');
                    for (var key in _this.checkins) {
                        if (_this.checkins[key].number == data.number) {
                            _this.checkins[key].content = data.content;
                            return;
                        }
                    }
                    _this.checkins.push(data);
                });
            });
        });
    };
    EventCmp.prototype.getUser = function (number) {
        var _this = this;
        this.service.getUserCheckIn(this.event.adminId, number).then(function (res) {
            console.log(res.json());
            _this.userCheckIn = res.json().userCheckIn;
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