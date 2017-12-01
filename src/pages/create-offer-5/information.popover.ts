import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'information-popover-component',
    templateUrl: 'information.popover.html'
})

export class CreateOfferInformationPopover {
    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams) {
    }
}
