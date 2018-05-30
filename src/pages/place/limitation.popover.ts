import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
    selector: 'limitation-popover-component',
    templateUrl: 'limitation.popover.html'
})

export class LimitationPopover {

    constructor(
        private viewCtrl: ViewController) {
    }

    close() {
        this.viewCtrl.dismiss();
    }
}