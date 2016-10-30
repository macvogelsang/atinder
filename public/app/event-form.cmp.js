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
var event_1 = require('./event');
var master_service_1 = require('./master.service');
var EventFormCmp = (function () {
    function EventFormCmp(service, route) {
        this.service = service;
        this.route = route;
        this.datesValid = true;
        this.model = new event_1.Event('', '', '', '', '', '', '');
        this.submitted = false;
        this.model.checkStart = new Date();
        this.model.checkEnd = new Date();
        this.tempDateStart = new Date();
        this.tempDateEnd = new Date();
        this.tempTimeStart = new Date();
        this.tempTimeEnd = new Date().setHours(this.tempTimeStart.getHours() + 1);
    }
    EventFormCmp.prototype.updateDates = function () {
        var t = this.tempDateStart;
        this.model.checkStart.setDate(t.getDate());
        this.model.checkStart.setMonth(t.getMonth());
        this.model.checkStart.setYear(t.getYear());
        var t = this.tempTimeStart;
        this.model.checkStart.setHours(t.getHours());
        this.model.checkStart.setMinutes(t.getMinutes());
        var t = this.tempDateEnd;
        this.model.checkEnd.setDate(t.getDate());
        this.model.checkEnd.setMonth(t.getMonth());
        this.model.checkEnd.setYear(t.getYear());
        var t = this.tempTimeEnd;
        this.model.checkEnd.setHours(t.getHours());
        this.model.checkEnd.setMinutes(t.getMinutes());
        console.log(this.model);
        //return true of start time is before end time
        return this.model.checkStart.getTime() < this.model.checkEnd.getTime();
    };
    EventFormCmp.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        this.datesValid = this.updateDates();
        if (this.datesValid) {
            this.service.createEvent(this.model).then(function (res) {
                console.log(res.json());
                _this.adminId = res.json().adminId;
                var link = ['/', adminId];
                _this.router.navigate(link);
            });
        }
    };
    Object.defineProperty(EventFormCmp.prototype, "diagnostic", {
        // TODO: Remove this when we're done
        get: function () { return JSON.stringify(this.model); },
        enumerable: true,
        configurable: true
    });
    EventFormCmp = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'event-form',
            templateUrl: 'event-form.cmp.html',
            providers: [master_service_1.MasterService]
        }), 
        __metadata('design:paramtypes', [master_service_1.MasterService, router_1.ActivatedRoute])
    ], EventFormCmp);
    return EventFormCmp;
}());
exports.EventFormCmp = EventFormCmp;
//# sourceMappingURL=event-form.cmp.js.map