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
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
require('rxjs/add/operator/toPromise');
var MasterService = (function () {
    // private headers = new Headers({'Content-Type': 'application/json'});
    function MasterService(http) {
        this.http = http;
        this.url = "silo.cs.indiana.edu:56789";
    }
    MasterService.prototype.createEvent = function (event) {
        return this.http
            .post('/createEvent', event)
            .toPromise()
            .then(function (res) { return res; })
            .catch(function (err) { return console.log(err); });
    };
    MasterService.prototype.getAdminDashboard = function (adminId) {
        return this.http
            .post('/getAdminPage', { adminId: adminId })
            .toPromise()
            .then(function (res) { return res; })
            .catch(function (err) { return console.log(err); });
    };
    MasterService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], MasterService);
    return MasterService;
}());
exports.MasterService = MasterService;
//# sourceMappingURL=master.service.js.map