import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
    selector: 'complaint-popover-component',
    templateUrl: 'complaint.popover.html'
})

export class ComplaintPopover {

    constructor(
        private viewCtrl: ViewController) {

    }
}