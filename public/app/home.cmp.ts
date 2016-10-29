import { Component } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: 'app/home.cmp.html'
})
export class HomeCmp {
    formHidden = true;

    showForm(){
        this.formHidden = false;

    }
}
