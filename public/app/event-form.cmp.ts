import { Component } from '@angular/core';
import { Event }    from './event';
import {MasterService} from './master.service';

@Component({
  moduleId: module.id,
  selector: 'event-form',
  templateUrl: 'event-form.cmp.html',
  providers: [MasterService]
})
export class EventFormCmp {
  model = new Event(
  	 '',
  	 '',
  	 '',
  	 '',
  	 '',
  	 '',
  	''
  );

  constructor(private service: MasterService){

  }
  submitted = false;
  onSubmit() {
	  this.submitted = true;
	  this.service.createEvent(this.model).then(res => {
		  console.log(res.json())
	  })
  }
  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }
}
