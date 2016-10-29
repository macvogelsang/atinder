import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { AppCmp }   from './app.cmp';

import {HomeCmp} from './home.cmp';
import {DashboardCmp} from './dashboard.cmp';
import {EventCmp} from './event.cmp';
// import {NotFoundCmp} from './notfound.cmp';

@NgModule({
  imports: [ 
      BrowserModule,
      FormsModule,
      RouterModule.forRoot([
          { path: 'event/:id', component: EventCmp },
          { path: ':id', component: DashboardCmp },
          { path: '', component: HomeCmp },
          { path: '**', component: HomeCmp }
      ]),
  ],
  declarations: [ 
      AppCmp,
      HomeCmp,
      DashboardCmp,
      EventCmp
  ],
  bootstrap:    [ AppCmp ]
})
export class AppModule { }
