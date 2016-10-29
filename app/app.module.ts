import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppCmp }   from './app.cmp';
@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppCmp ],
  bootstrap:    [ AppCmp ]
})
export class AppModule { }
