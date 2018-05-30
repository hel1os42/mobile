import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Offer } from '../../models/offer';
import { LimitationFlagsUtils } from '../../utils/limitation-flags.utils';

@Component({
    selector: 'limitation-popover-component',
    templateUrl: 'limitation.popover.html'
})

export class LimitationPopover {

    offer: Offer;
    keys = [];

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams) {

        this.offer = this.navParams.get('offer');
        this.keys = LimitationFlagsUtils.extractFlags(this.offer.redemption_access_code);
    }

    close() {
        this.viewCtrl.dismiss();
    }
}