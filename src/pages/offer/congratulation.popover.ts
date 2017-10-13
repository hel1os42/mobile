import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
    selector: 'congratulation-popover-component',
    templateUrl: 'congratulation.popover.html'
})

export class CongratulationPopover {
    constructor(
        private viewCtrl: ViewController) { }

    close() {
        this.viewCtrl.dismiss();
    }
}