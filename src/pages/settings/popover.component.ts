import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
    selector: 'popover-component',
    templateUrl: 'popover.component.html'
})

export class PopoverComponent {
    constructor(
        private viewCtrl: ViewController) { }

    close() {
        this.viewCtrl.dismiss();
    }
}