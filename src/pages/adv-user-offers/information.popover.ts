import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'information-popover-component',
    templateUrl: 'information.popover.html'
})

export class CreateOfferInformationPopover {

    balance: number;
    reserved: number;

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams) {

        this.balance = this.navParams.get('balance');
        this.reserved = this.navParams.get('reserved');
    }

    close() {
        this.viewCtrl.dismiss();
    }
}
