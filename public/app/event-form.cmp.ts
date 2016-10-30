import { Component, Input } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Event }    from './event';
import {MasterService} from './master.service';

@Component({
  moduleId: module.id,
  selector: 'event-form',
  templateUrl: 'event-form.cmp.html',
  providers: [MasterService]
})
export class EventFormCmp {
    datesValid: boolean = true;
    @Input() adminId = "";

	tempDateStart;
	tempDateEnd;
	tempTimeStart;
	tempTimeEnd;

  model = new Event(
  	 '',
  	 '',
  	 '',
  	 '',
  	 '',
  	 '',
  	''
  );

  minDate = new Date();

  constructor(private service: MasterService, private router: Router){
	  this.model.checkStart = new Date();
	  this.model.checkEnd = new Date();

	  this.tempDateStart = new Date();
	  this.tempDateEnd = new Date();

	  this.tempTimeStart = new Date();
	  this.tempTimeEnd = new Date().setHours(this.tempTimeStart.getHours() + 1 );

  }
  updateDates(): boolean {
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

      console.log(this.model)
      //return true of start time is before end time
      return this.model.checkStart.getTime() < this.model.checkEnd.getTime()


  }
  submitted = false;
  onSubmit() {
	  this.submitted = true;
      this.model.adminId = this.adminId;
      this.datesValid = this.updateDates()
      if (this.datesValid){
          this.service.createEvent(this.model).then(res => {
    		  console.log(res.json())
              this.adminId = res.json().adminId;
              let link = ['/', this.adminId];
              this.router.navigate(link);
    	  })
      }
  }
  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }
}
