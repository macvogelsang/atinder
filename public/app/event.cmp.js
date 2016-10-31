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
    function EventCmp(service, route, router) {
        this.service = service;
        this.route = route;
        this.router = router;
        this.checkins = [
            {
                number: "11234567890",
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            },
            {
                number: "1234567890",
                content: 'Mac Voeu fugiat nulla pariatur. Excepteur sint occaecat cupidatat gelsang'
            },
            {
                number: "1234567890",
                content: 'Mac Vogelsang 2'
            },
            {
                number: "1234567890",
                content: 'Mac Vlore eu fugiat nulogelsang 3'
            },
            {
                number: "11234567890",
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            },
            {
                number: "1234567890",
                content: 'Mac Voeu fugiat nulla pariatur. Excepteur sint occaecat cupidatat gelsang'
            },
            {
                number: "1234567890",
                content: 'Mac Vogelsang 2'
            },
            {
                number: "1234567890",
                content: 'Mac Vlore eu fugiat nulogelsang 3'
            }
        ];
        this.showpage = false;
        this.userCheckIn = "";
    }
    EventCmp.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            _this.eventId = params['eventid'];
            _this.adminId = params['adminid'];
            _this.service.getInitialCheckIns(_this.eventId).then(function (res) {
                console.log(res.json());
                _this.checkins = res.json().checks;
                _this.event = res.json().ronaldSet[0];
                if (_this.event == null) {
                    _this.router.navigate('/notfound');
                }
                if (_this.event.adminId !== _this.adminId) {
                    _this.router.navigate('/notfound');
                }
                _this.showpage = true;
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
                    _this.checkins.unshift(data);
                });
            });
        });
    };
    EventCmp.prototype.exportCSV = function () {
        var filename = "event" + this.eventId + ".csv";
        var fields = ['number', 'content'];
        var csv = json2csv({ data: this.checkins, fields: fields });
        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
    EventCmp.prototype.getUser = function (number) {
        var _this = this;
        if (this.selected == number) {
            this.selected = "";
            this.userCheckIn = "";
            return;
        }
        this.selected = number;
        this.service.getUserCheckIn(this.event.adminId, number).then(function (res) {
            console.log(res.json());
            _this.userCheckIn = res.json().events;
        });
    };
    EventCmp = __decorate([
        core_1.Component({
            selector: 'event',
            templateUrl: 'app/event.cmp.html',
            providers: [master_service_1.MasterService]
        }), 
        __metadata('design:paramtypes', [master_service_1.MasterService, router_1.ActivatedRoute, router_1.Router])
    ], EventCmp);
    return EventCmp;
}());
exports.EventCmp = EventCmp;
//# sourceMappingURL=event.cmp.js.map