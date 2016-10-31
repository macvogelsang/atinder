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
var platform_browser_1 = require('@angular/platform-browser');
var router_1 = require('@angular/router');
var forms_1 = require('@angular/forms');
var app_cmp_1 = require('./app.cmp');
var http_1 = require('@angular/http');
var datepicker_1 = require('ng2-bootstrap/components/datepicker');
var timepicker_1 = require('ng2-bootstrap/components/timepicker');
var home_cmp_1 = require('./home.cmp');
var dashboard_cmp_1 = require('./dashboard.cmp');
var event_cmp_1 = require('./event.cmp');
var event_form_cmp_1 = require('./event-form.cmp');
var notfound_cmp_1 = require('./notfound.cmp');
// import {MasterService} from './master.service';
// import {NotFoundCmp} from './notfound.cmp';
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                datepicker_1.DatepickerModule,
                timepicker_1.TimepickerModule,
                router_1.RouterModule.forRoot([
                    { path: 'event/:eventid', component: event_cmp_1.EventCmp },
                    { path: 'notfound', component: notfound_cmp_1.NotfoundCmp },
                    { path: ':adminid', component: dashboard_cmp_1.DashboardCmp },
                    { path: '', component: home_cmp_1.HomeCmp },
                    { path: '**', component: notfound_cmp_1.NotfoundCmp }
                ]),
            ],
            declarations: [
                app_cmp_1.AppCmp,
                home_cmp_1.HomeCmp,
                dashboard_cmp_1.DashboardCmp,
                event_cmp_1.EventCmp,
                event_form_cmp_1.EventFormCmp,
                notfound_cmp_1.NotfoundCmp
            ],
            bootstrap: [app_cmp_1.AppCmp]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map