import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
    selector: 'createOffer-popover-component',
    templateUrl: 'createOffer.popover.html'
})

export class CreateOfferPopover {
    constructor(
        private viewCtrl: ViewController) { }

    close() {
        this.viewCtrl.dismiss();
    }
}